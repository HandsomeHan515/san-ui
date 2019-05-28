"use strict";

var fs = require('fs');
var vm = require('vm');
var util = require('util');
var path = require('path');
var url = require('url');
var querystring = require('querystring');

var _ = require('underscore');
var request = require('request');
var async = require('async');

var dataEncoding = "utf-8";

var mockManager = {
    respFuncMap: {
        "proxy_pass": function (confResp, context, done) {
            var mockUrlObj = url.parse(confResp);
            var mockQueryStringObj = querystring.parse(mockUrlObj.query);

            var req = context.req;
            var reqUrlObj = url.parse(req.url);
            var reqQueryStringObj = querystring.parse(reqUrlObj.query);

            mockUrlObj.query = querystring.stringify({}, mockQueryStringObj, reqQueryStringObj);
            mockUrlObj.search = "?" + mockUrlObj.query;
            var proxyOptions = {
                set_header: {}
            };
            proxyOptions.url = url.format(reqUrlObj);
            proxyOptions.headers = _.extend({}, req.headers, {
                host: mockUrlObj.host
            });
            var result,
                reqMethod = req.method.toUpperCase();
            if (reqMethod === 'GET') {
                result = request.get(proxyOptions).pipe(context.resp);
            } else if (reqMethod === 'POST') {
                result = request.post(proxyOptions).pipe(context.resp);
            }
            return result.on('end', function () {
                return done();
            });
        },
        "action": function (confResp, context, done) {
            if (!util.isFunction(confResp)) {
                var content = mockManager.getContent(confResp);
                var mockRespBuffer = {
                    module: {}
                }
                var baseObj;
                var resp = context.resp;
                try {
                    vm.runInNewContext(content, mockRespBuffer);
                    baseObj = mockRespBuffer.module;
                    if (util.isFunction(baseObj.exports)) {
                        baseObj.exports(context.req, resp, context);
                    } else if (util.isObject(baseObj.exports)) {
                        resp.setHeader('Content-Type', 'application/json');
                        resp.write(JSON.stringify(baseObj.exports), dataEncoding);
                    }
                } catch (error) {
                    console.log("执行" + confResp + '失败：', e);
                }
            } else {
                confResp(context.req, resp.context);
            }
            return done();
        },
        "row": function (confResp, context, done) {
            var jsonp = context.rule.jsonp || 'callback';
            var queryObj = context.req.query;
            var callback;
            for (key in queryObj) {
                if (key === jsonp) {
                    callback = queryObj[key];
                }
            }
            var resp = context.resp;
            var jsonString = mockManager.getContent(confResp);
            if (callback) {
                resp.setHeader('Content-Type', 'application/x-javascript');
                jsonString = [callback, '(', jsonString.trim(), ')'].join('');
            } else {
                resp.setHeader('Content-Type', 'application/json');
            }
            resp.write(jsonString);
            return done();
        }
    },
    getActionKey: function (mockResp) {
        if (/https?:\/\//.test(mockResp)) {
            return 'proxy_pass';
        } else {
            var extName = path.extname(mockResp);
            switch (extName) {
                case '.json':
                    return "raw";
                case '.js':
                    return "action";
                default:
                    return "raw";
            }
        }
    },
    getContent: function (relativePath) {
        var dirname = path.dirname(this.mockConf);
        var filePath = path.dirname(dirname, relativePath)
        var targetPath;
        if (fs.existsSync(filePath)) {
            targetPath = filePath
        } else if (fs.existsSync(filePath + '.json')) {
            targetPath = filePath + '.json';
        } else if (fs.existsSync(filePath + '.js')) {
            targetPath = filePath + '.js';
        } else {
            throw new Error("path: " + relativePath + " not exists");
        }
        return fs.readFileSync(targetPath, dataEncoding);
    },
    getMockRule: function (url) {
        var mockRules = this.mockRules;
        var tmpRule, result;
        for (var i = 0, mockConfs = mockRules.length; i < mockConfs; i++) {
            tmpRule = mockRules[i]
            if (util.isRegExp(tmpRule.pattern)) {
                result = url.match(tmpRule.pattern);
            } else {
                result = url.indexOf(tmpRule.pattern) === 0;
            }
            if (result) {
                return tmpRule;
            }
        }
        return null;
    },
    init: function (mockConf) {
        var confFileStat = fs.statSync(mockConf);
        this.mockConf = mockConf;
        this.mockConfMtime = confFileStat.mtime;
        this.mockRules = [];
        this.checkInterval = 1000;
        this.doUpdate();
        this.lastCheckTime = new Date();
    },
    doResponse: function (mockRule, req, resp, options) {
        var mockResp = mockRule.responder;
        var actionKey = "action";
        if (typeof mockResp === 'string') {
            actionKey = this.getActionKey(mockResp);
        }
        console.log('API REQUEST: ', req.url, ' => mocked to => ', sysPath.resolve(mockResp));
        var respFunc = this.respFuncMap[actionKey];
        var respTasks = [function (seriesCallback) {
            return respFunc(mockResp, {
                req: req,
                resp: resp,
                rule: mockRule,
                options: options
            }, seriesCallback);
        }];
        return async.series(respTasks, function (err) {
            if (err) {
                return resp.end(err);
            } else {
                return resp.end();
            }
        });
    },
    doUpdate: function () {
        var self = this;
        var now = new Date();
        if (now - this.lastCheckTime >= self.checkInterval) {
            var checkFileStat = fs.statSync(self.mockConf);
            if (checkFileStat.mtime !== self.mockConfMtime) {
                try {
                    var mockConfBuffer = {
                        module: {}
                    };
                    var content = fs.readFileSync(this.mockConf, dataEncoding);
                    vm.runInNewContext(content, mockConfBuffer)
                    var configObj = mockConfBuffer.module.exports;
                    var tmpRules = configObj.rules || [];
                    var tmpKey, tmpAction;
                    delete configObj.rules;
                    for (tmpKey in configObj) {
                        tmpAction = configObj[tmpKey];
                        tmpRules.push({
                            pattern: tmpKey,
                            responder: tmpAction
                        });
                    }
                    self.mockRules = tmpRules;
                } catch (error) {
                    console.log('mock 配置文件出错：', error.toString());
                }
            }
        }
    }
}

function noMock(req, resp, next) {
    return next();
}

module.exports = function (options) {
    var mockConf = options.mockConf;
    if (mockConf) {
        if (!fs.existsSync(mockConf)) {
            console.log('mock配置' + mockConf + '不存在');
            return noMock;
        }
    } else {
        return noMock;
    }
    mockManager.init(mockConf);
    return function (req, resp, next) {
        mockManager.doUpdate();
        var mockRule = mockManager.getMockRule(req.url);
        if (mockRule) {
            return mockManager.doResponse(mockRule, req, resp, options);
        } else {
            return next();
        }
    }
}