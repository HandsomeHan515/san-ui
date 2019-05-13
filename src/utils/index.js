function isType(obj, type) {
    return Object.prototype.toString.call(obj) === '[object ' + type + ']'
}

function isArray(obj) {
    return isType(obj, 'Array')
}

function isString(obj) {
    return isType(obj, 'String')
}

module.exports = {
    isString,
    isArray,
}