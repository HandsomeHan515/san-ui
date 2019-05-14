const san = require('san')
const { DataTypes } = require('san')
const { formatDate } = require('@/utils/date')
const { inAfter, inBefore, inDisabledDays, weeks } = require('./util')

module.exports = san.defineComponent({
    template: `
        <div class='b-panel b-panel-date'>
            <ol class='b-date-header'>
                <li 
                    class="b-date-header-item" 
                    s-for="day in days">
                    {{ day }}
                </li>
            </ol>
            <ul class='b-date-body'>
                <li 
                    class="cell b-date-body-item {{getCellClasses(date)}}"
                    s-for="date in dates"
                    title="{{getCellTitle(date)}}"
                    on-click="selectDate(date)">
                    {{ date.day }}
                </li>
            </ul>
        </div>
    `,
    dataTypes: {
        month: DataTypes.number.isRequired,
        year: DataTypes.number.isRequired,
        dateFormat: DataTypes.string,
        firstDayOfWeek: DataTypes.number,
    },
    initData() {
        return {
            // Props:
            value: null,
            startAt: null,
            endAt: null,
            dateFormat: 'yyyy-MM-dd',
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
            firstDayOfWeek: 7,
        }
    },
    computed: {
        dates() {
            const year = this.data.get('year')
            const month = this.data.get('month')
            const firstDayOfWeek = this.data.get('firstDayOfWeek')

            let arr = []
            let time = new Date(year, month)

            time.setDate(0) // 把时间切换到上个月最后一天
            let lastMonthLength = (time.getDay() + 7 - firstDayOfWeek) % 7 + 1 // time.getDay() 0是星期天, 1是星期一 ...
            let lastMonthfirst = time.getDate() - (lastMonthLength - 1)
            for (let i = 0; i < lastMonthLength; i++) {
                arr.push({ year, month: month - 1, day: lastMonthfirst + i })
            }

            time.setMonth(time.getMonth() + 2, 0) // 切换到这个月最后一天
            let curMonthLength = time.getDate()
            for (let i = 0; i < curMonthLength; i++) {
                arr.push({ year, month, day: 1 + i })
            }

            time.setMonth(time.getMonth() + 1, 1) // 切换到下个月第一天
            let nextMonthLength = 42 - (lastMonthLength + curMonthLength)
            for (let i = 0; i < nextMonthLength; i++) {
                arr.push({ year, month: month + 1, day: 1 + i })
            }

            return arr
        },
        days() {
            const firstDayOfWeek = this.data.get('firstDayOfWeek')
            const days = weeks.slice(0)
            const firstDay = parseInt(firstDayOfWeek, 10)
            return days.concat(days).slice(firstDay, firstDay + 7)
        }
    },
    selectDate({ year, month, day }) {
        const date = new Date(year, month, day)
        if (this.disabledDate(date)) return

        this.fire('select', date)
    },
    getCellClasses({ year, month, day }) {
        let classes = []
        let cellTime = new Date(year, month, day).getTime()
        let today = new Date().setHours(0, 0, 0, 0)
        let curTime = this.data.get('value') && new Date(this.data.get('value')).setHours(0, 0, 0, 0)
        let startTime = this.data.get('startAt') && new Date(this.data.get('startAt')).setHours(0, 0, 0, 0)
        let endTime = this.data.get('endAt') && new Date(this.data.get('endAt')).setHours(0, 0, 0, 0)

        if (month < this.data.get('month')) {
            classes.push('last-month')
        } else if (month > this.data.get('month')) {
            classes.push('next-month')
        } else {
            classes.push('cur-month')
        }

        if (cellTime === today) {
            classes.push('today')
        }

        if (this.disabledDate(cellTime)) {
            classes.push('disabled')
        }

        if (curTime) {
            if (cellTime === curTime) {
                classes.push('actived')
            } else if (startTime && cellTime <= curTime) {
                classes.push('inrange')
            } else if (endTime && cellTime >= curTime) {
                classes.push('inrange')
            }
        }

        return classes
    },
    getCellTitle({ year, month, day }) {
        return formatDate(new Date(year, month, day), this.data.get('dateFormat'))
    },
    disabledDate(date) {
        const time = new Date(date).getTime()
        const maxTime = new Date(date).setHours(23, 59, 59, 999)
        const { notBefore, notAfter, disabledDays } = this.data.get()
        return inBefore(maxTime, notBefore) || inAfter(time, notAfter) || inDisabledDays(time, disabledDays)
    }
})
