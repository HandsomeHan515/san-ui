const san = require('san')

module.exports = san.defineComponent({
    template: `
        <div class='hello'>
            {{text}}
            <button on-click='handleClick'>按钮</button>
        </div>
    `,
    initData() {
        return {
            text: 'hello world'
        }
    },
    handleClick() {
        this.data.set('text', 'name')
    }
})