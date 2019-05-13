const san = require('san')
const { inAfter, inBefore, inDisabledDays } = require('./util')

module.exports = san.defineComponent({
    template: `
        <div class='b-panel b-panel-year'>
            <span
                class="cell {{ curYear === startYear + i ? 'actived' : '' }} {{ isDisabled(startYear + i) ? 'disabled' : '' }}"
                s-for="item, i in list"
                on-click='selectYear(startYear + i)'>
                {{ startYear + i }}
            </span>
        </div>
    `,
    initData() {
        return {
            list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
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
    isDisabled(year) {
        return !!this.disabledYear(year)
    },
    selectYear(year) {
        if (this.disabledYear(year)) return

        this.fire('select', year)
    },
    disabledYear(year) {
        const time = new Date(year, 0).getTime()
        const maxTime = new Date(year + 1, 0).getTime() - 1
        const { notBefore, notAfter, disabledDays, type } = this.data.get()
        return inBefore(maxTime, notBefore)
            || inAfter(time, notAfter)
            || (type == 'year' && inDisabledDays(time, disabledDays))
    },
})

/**
 * Props:
 * value
 * firstYear
 */