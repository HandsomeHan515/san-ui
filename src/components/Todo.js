const san = require('san')
const Link = require('san-router').Link
const Button = require('./button/Button')

module.exports = san.defineComponent({
    template: `
        <div class='hello'>
            {{text}}
            <b-link to='/year'>年度</b-link>
            <b-link to='/month'>月份</b-link>
            <b-link to='/date'>日历</b-link>
            <b-button type="success" long>成功</b-button>
            <b-button type="warning">警告</b-button>
            <b-button type="info">提示</b-button>
            <b-button type="error">错误</b-button>
        </div>
    `,
    initData() {
        return {
            text: 'hello world'
        }
    },
    components: {
        'b-link': Link,
        'b-button': Button
    },
    handleClick() {
        this.data.set('text', 'name')
    },
    created() {
        let aNode = san.parseTemplate('<p>Hello {{text}}</p>')
        console.log('aNode', aNode)
    }
})