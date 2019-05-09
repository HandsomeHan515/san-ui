const san = require('san')

module.exports = san.defineComponent({
    template: `
        <div>
            <span
                s-for="item, i in list"
                on-click='selectYear(startYear + i)'>
                {{ startYear + i }}
            </span>
        </div>
    `,
    initData() {
        return {
            value: null,
            list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            firstYear: 2019
        }
    },
    computed: {
        startYear() {
            return Math.floor(this.data.get('firstYear') / 10) * 10
        },
        curYear() {
            const value = this.data.get('value')
            return value && new Date(value).getFullYear()
        }
    },
    selectYear(year) {
        this.fire('select', year)
    }
})