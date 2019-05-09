const san = require('san')
const { months } = require('./util')

module.exports = san.defineComponent({
    template: `
        <div>
            <span
                s-for="month, i in months"
                on-click='selectMonth(i)'>
                {{ month }}
            </span>
        </div>
    `,
    initData() {
        return {
            months: months
        }
    },
    computed: {
        curYear() {
            const value = this.data.get('value')
            return value && new Date(value).getFullYear()
        },
        curMonth() {
            const value = this.data.get('value')
            return value && new Date(value).getMonth()
        }
    },
    selectMonth(month) {
        this.fire('select', month)
    }
})