const san = require('san')
const { formatDate } = require('../../../utils/date')
const { weeks } = require('./util')

module.exports = san.defineComponent({
    template: `
        <div>
            <thead>
                <th s-for="day in getDays(firstDayOfWeek)">
                    {{ day }}
                </th>
            </thead>
            <tbody>
                <tr s-for="week, i in [1,2,3,4,5,6]">
                    <td
                        class="cell"
                        s-for="date, index in getDates(year, month, firstDayOfWeek, i)"
                        title="{{getCellTitle(date)}}"
                        on-click="selectDate(date)">
                        {{ date.day }}
                    </td>
                </tr>
            </tbody>
        </div>
    `,
    initData() {
        return {
            value: null,
            startAt: null,
            endAt: null,
            dateFormat: 'yyyy-MM-dd',
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
            firstDayOfWeek: 7,
            disabledDate: () => false
        }
    },
    computed: {},
    selectDate({ year, month, day }) {
        const date = new Date(year, month, day)
        this.fire('select', date)
    },
    getDays(firstDayOfWeek) {
        const days = weeks.slice(0)
        const firstDay = parseInt(firstDayOfWeek, 10)
        return days.concat(days).slice(firstDay, firstDay + 7)
    },
    getDates(year, month, firstDayOfWeek, i) {
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
        return arr.slice(7 * i, 7 * i + 7)
    },
    getCellTitle({ year, month, day }) {
        return formatDate(new Date(year, month, day), this.data.get('dateFormat'))
    }
})
