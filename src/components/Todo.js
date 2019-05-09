const san = require('san')
const Link = require('san-router').Link

module.exports = san.defineComponent({
    template: `
        <div class='hello'>
            {{text}}
            <button on-click='handleClick'>按钮</button>
            <b-link to='/year'>年度</b-link>
            <b-link to='/month'>月份</b-link>
            <b-link to='/date'>日历</b-link>
        </div>
    `,
    initData() {
        return {
            text: 'hello world'
        }
    },
    components: {
        'b-link': Link
    },
    handleClick() {
        this.data.set('text', 'name')
    }
})