const san = require('san')
const { inAfter, inBefore, inDisabledDays, months } = require('./util')

module.exports = san.defineComponent({
    template: `
        <div class='b-panel b-panel-month'>
            <span
                class="cell {{ curYear === year && curMonth === i ? 'actived' : '' }} {{ isDisabled(i) ? 'disabled' : '' }}"
                s-for="month, i in months"
                on-click='selectMonth(i)'>
                {{ month }}
            </span>
        </div>
    `,
    initData() {
        return {
            months: months,
            // Props:
            value: null,
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
        if (this.disabledMonth(month)) return

        this.fire('select', month)
    },
    isDisabled(month) {
        return !!this.disabledMonth(month)
    },
    disabledMonth(month) {
        const { year } = this.data.get()
        const time = new Date(year, month).getTime()
        const maxTime = new Date(year, month + 1).getTime() - 1
        const { notBefore, notAfter, disabledDays, type } = this.data.get()
        return inBefore(maxTime, notBefore)
            || inAfter(time, notAfter)
            || (type == 'month' && inDisabledDays(time, disabledDays))
    }
})
