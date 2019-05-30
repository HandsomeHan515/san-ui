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
                    class="cell b-date-body-item {{getDisabledClasses(date)}} {{date.classes}}"
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
            // 判断样式
            const value = this.data.get('value')
            const startAt = this.data.get('startAt')
            const endAt = this.data.get('endAt')
            let today = new Date().setHours(0, 0, 0, 0)
            let curTime = value && new Date(value).setHours(0, 0, 0, 0)
            let startTime = startAt && new Date(startAt).setHours(0, 0, 0, 0)
            let endTime = endAt && new Date(endAt).setHours(0, 0, 0, 0)
            //
            const year = this.data.get('year')
            const month = this.data.get('month')
            const firstDayOfWeek = this.data.get('firstDayOfWeek')

            const getCellClasses = function (year, month, day) {
                let classes = []
                const cellTime = new Date(year, month, day).getTime()
                if (cellTime === today) {
                    classes.push('today')
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
            }

            let arr = []
            let time = new Date(year, month)

            time.setDate(0) // 把时间切换到上个月最后一天
            let lastMonthLength = (time.getDay() + 7 - firstDayOfWeek) % 7 + 1 // time.getDay() 0是星期天, 1是星期一 ...
            let lastMonthfirst = time.getDate() - (lastMonthLength - 1)
            for (let i = 0; i < lastMonthLength; i++) {
                const classes = ['last-month'].concat(getCellClasses(year, month - 1, lastMonthfirst + i))
                arr.push({ year, month: month - 1, day: lastMonthfirst + i, classes })
            }

            time.setMonth(time.getMonth() + 2, 0) // 切换到这个月最后一天
            let curMonthLength = time.getDate()
            for (let i = 0; i < curMonthLength; i++) {
                const classes = ['cur-month'].concat(getCellClasses(year, month, i + 1))
                arr.push({ year, month, day: 1 + i, classes })
            }

            time.setMonth(time.getMonth() + 1, 1) // 切换到下个月第一天
            let nextMonthLength = 42 - (lastMonthLength + curMonthLength)
            for (let i = 0; i < nextMonthLength; i++) {
                const classes = ['next-month'].concat(getCellClasses(year, month + 1, i + 1))
                arr.push({ year, month: month + 1, day: 1 + i, classes })
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
    getDisabledClasses({ year, month, day }) {
        const cellTime = new Date(year, month, day).getTime()
        if (this.disabledDate(cellTime)) return 'disabled'

        return ''
    },
    getCellTitle({ year, month, day }) {
        return formatDate(new Date(year, month, day), this.data.get('dateFormat'))
    },
    disabledDate(date) {
        const time = new Date(date).getTime()
        const maxTime = new Date(date).setHours(23, 59, 59, 999)
        const { notBefore, notAfter, disabledDays, startAt, endAt } = this.data.get()
        return inBefore(maxTime, notBefore, startAt) || inAfter(time, notAfter, endAt) || inDisabledDays(time, disabledDays)
    }
})
