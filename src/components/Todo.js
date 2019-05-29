const san = require('san')
const Link = require('san-router').Link
const Button = require('./button/Button')
const Datepicker = require('./date-picker/Pikcer')

module.exports = san.defineComponent({
    template: `
        <div class='hello'>
            <b-link to='/year'>年度</b-link>
            <b-link to='/month'>月份</b-link>
            <b-link to='/date'>日历</b-link>
            <div style="margin-top: 30px;">
                <b-button type="success">成功</b-button>
                <b-button type="warning">警告</b-button>
                <b-button type="info">提示</b-button>
                <b-button type="error">错误</b-button>
            </div>
            <div style="margin: 50px 300px;">
                <b-datepicker range on-change="handleChange"></b-datepicker>
            </div>
        </div>
    `,
    initData() {
        return {
        }
    },
    components: {
        'b-link': Link,
        'b-button': Button,
        'b-datepicker': Datepicker
    },
    handleClick() {
        this.data.set('text', 'name')
    },
    handleChange(val) {
        // console.log('change value', val)
    }
})