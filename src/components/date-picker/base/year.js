const san = require('san')
const { inAfter, inBefore, inDisabledDays } = require('./util')

module.exports = san.defineComponent({
    template: `
        <div class='b-panel b-panel-year'>
            <span
                class="cell {{item.classes}}"
                s-for="item in years"
                on-click='selectYear(item)'>
                {{ item.year }}
            </span>
        </div>
    `,
    computed: {
        startYear() {
            return Math.floor(this.data.get('firstYear') / 10) * 10
        },
        curYear() {
            const value = this.data.get('value')
            return value && new Date(value).getFullYear()
        },
        years() { // [{ year: 2019, classes: ['actived', 'disabled'] }, ...]
            const startYear = this.data.get('startYear')
            const curYear = this.data.get('curYear')
            const notBefore = this.data.get('notBefore')
            const notAfter = this.data.get('notAfter')
            const type = this.data.get('type')
            const disabledDays = this.data.get('disabledDays')
            const startAt = this.data.get('startAt')
            const endAt = this.data.get('endAt')
            let arr = []
            for (let i = 0; i < 10; i++) {
                const year = startYear + i
                let classes = []
                if (curYear === year) {
                    classes.push('actived')
                }
                const time = new Date(year, 0).getTime()
                const maxTime = new Date(year + 1, 0).getTime() - 1
                if (
                    inBefore(maxTime, notBefore, startAt)
                    || inAfter(time, notAfter, endAt)
                    || (type === 'year' && inDisabledDays(time, disabledDays))
                ) {
                    classes.push('disabled')
                }

                arr.push({ year, classes })
            }

            return arr
        }
    },
    selectYear(item) {
        if (item.classes.includes('disabled')) return

        this.fire('select', item.year)
    }
})

/**
 * Props:
 * value
 * firstYear
 */