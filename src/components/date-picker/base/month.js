const san = require('san')
const { months } = require('./util')

module.exports = san.defineComponent({
    template: `
        <div class='b-panel b-panel-month'>
            <span
                class='cell {{ actived: curYear === year && curMonth === i }}'
                s-for="month, i in months"
                on-click='selectMonth(i)'>
                {{ month }}
            </span>
        </div>
    `,
    initData() {
        return {
            months: months,
            year: new Date().getFullYear()
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

/**
 * Props:
 * value
 * year
 */