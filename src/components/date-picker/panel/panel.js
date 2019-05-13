const san = require('san')
const TableDate = require('../base/date')
const TableYear = require('../base/year')
const TableMonth = require('../base/month')

const { months } = require('../base/util')
const { isDateObject, formatDate } = require('../../../utils/date')

module.exports = san.defineComponent({
    template: `
        <div class='b-calendar'>
            <div class='b-calendar-header'>
                <a
                    s-if="panel !== 'TIME'"
                    class="b-icon-last-year"
                    on-click="handleIconYear(-1)">
                    <<
                </a>
                <a
                    s-if="panel === 'DATE'"
                    class="b-icon-last-month"
                    on-click="handleIconMonth(-1)">
                    <
                </a>
                <a
                    s-if="panel === 'YEAR'"
                    class="b-current-year">
                    {{yearHeader}}
                </a>
                <a
                    s-if="panel === 'DATE'"
                    class="b-current-month"
                    on-click="handleClickMonth">
                    {{months[month]}}
                </a>
                <a
                    s-if="panel === 'DATE' || panel === 'MONTH'"
                    class="b-current-year"
                    on-click="handleClickYear">
                    {{ year + ' 年' }}
                </a>
                <a
                    s-if="panel !== 'TIME'"
                    class="b-icon-next-year"
                    on-click="handleIconYear(1)">
                    >>
                </a>
                <a
                    s-if="panel === 'DATE'"
                    class="b-icon-next-month"
                    on-click="handleIconMonth(1)">
                    >
                </a>
                <a
                    s-if="panel === 'TIME'"
                    class="b-time-header"
                    on-click="handleTimeHeader">
                    {{ timeHeade r}}
                </a>
            </div>
            <div class='b-calendar-content'>
                <b-table-year
                    s-if="panel === 'YEAR'"
                    value='{{value}}'
                    type="{{type}}"
                    first-year='{{firstYear}}'
                    not-before="{{notBefore}}"
                    not-after="{{notAfter}}"
                    disabled-days="{{disabledDays}}"
                    on-select="selectYear">
                </b-table-year>
                <b-table-month
                    s-if="panel === 'MONTH'"
                    value='{{value}}'
                    type="{{type}}"
                    year='{{year}}'
                    not-before="{{notBefore}}"
                    not-after="{{notAfter}}"
                    disabled-days="{{disabledDays}}"
                    on-select="selectMonth">
                </b-table-month>
                <b-table-date
                    s-if="panel === 'DATE'"
                    value='{{value}}'
                    type="{{type}}"
                    year='{{year}}'
                    month='{{month}}'
                    not-before="{{notBefore}}"
                    not-after="{{notAfter}}"
                    disabled-days="{{disabledDays}}"
                    first-day-of-week='{{firstDayOfWeek}}'
                    on-select="selectDate">
                </b-table-date>
            </div>
        </div>
    `,
    components: {
        'b-table-date': TableDate,
        'b-table-year': TableYear,
        'b-table-month': TableMonth
    },
    initData() {
        const _date = new Date()
        const _year = _date.getFullYear()
        const _month = _date.getMonth()
        const _firstYear = Math.floor(_year / 10) * 10

        return {
            panel: 'DATE',
            dates: [],
            year: _year,
            month: _month,
            firstYear: _firstYear,
            months,
            value: null,
            type: 'date'
        }
    },
    computed: {
        yearHeader() {
            return `${this.data.get('firstYear')} ~ ${this.data.get('firstYear') + 9}`
        },
        timeHeader() {
            if (this.data.get('type') === 'time') {
                return 'HH:mm:ss'
            }
            return this.data.get('value')
                ? formatDate(this.data.get('value'), this.data.get('dateFormat'))
                : ''
        },
        now() {
            return new Date(this.data.get('year'), this.data.get('month')).getTime()
        }
    },
    attached() {
        this.watch('now', val => {
            const _date = new Date(val)
            this.data.set('year', _date.getFullYear())
            this.data.set('month', _date.getMonth())
        })

        this.watch('value', val => {
            this.updateNow(val)
        })

        this.watch('panel', val => {
            if (val === 'YEAR') {
                this.data.set('firstYear', Math.floor(this.data.get('year') / 10) * 10)
            }
        })
    },
    updateNow(val) {
        const now = val ? new Date(val) : new Date()
        const oldNow = new Date(this.data.get('now'))
        this.data.set('now', now)
        if (!this.data.get('visible')) {
            this.fire('calendar-change', now, oldNow)
        }
    },
    init(val) {
        if (val) {
            switch (this.data.get('type')) {
                case 'year':
                    this.data.set('panel', 'YEAR')
                    break
                case 'month':
                    this.data.set('panel', 'MONTH')
                    break
                case 'date':
                    this.data.set('panel', 'DATE')
                    break
                case 'time':
                    this.data.set('panel', 'TIME')
                    break
                default:
                    this.data.set('panel', 'DATE')
            }
        } else {
            this.updateNow(this.data.get('value'))
        }
    },
    changePanelYears(flag) {
        const firstYear = this.data.get('firstYear') + flag * 10
        this.data.set('firstYear', firstYear)
    },
    handleIconYear(flag) {
        if (this.data.get('panel') === 'YEAR') {
            this.changePanelYears(flag)
        } else {
            this.changeYear(this.data.get('year') + flag)
        }
    },
    handleIconMonth(flag) {
        this.changeMonth(this.data.get('month') + flag)
    },
    handleTimeHeader() {
        if (this.data.get('type') === 'time') return
        this.data.set('panel', 'DATE')
    },
    selectDate(date) {
        if (this.data.get('type') === 'datetime') {
            let time = new Date(date)
            if (isDateObject(this.data.get('value'))) {
                time.setHours(
                    this.data.get('value').getHours(),
                    this.data.get('value').getMinutes(),
                    this.data.get('value').getSeconds()
                )
            }
            this.selectTime(time)
            return
        }
        this.fire('select-date', date)
    },
    changeYear(year) {
        this.updateNow(new Date(year, this.data.get('month')))
    },
    changeMonth(month) {
        this.updateNow(new Date(this.data.get('year'), month))
    },
    selectYear(year) {
        this.changeYear(year)
        if (this.data.get('type') === 'year') {
            return this.selectDate(new Date(this.data.get('now')))
        }
        this.data.set('panel', 'MONTH')
    },
    selectMonth(month) {
        this.changeMonth(month)
        if (this.data.get('type') === 'month') {
            return this.selectDate(new Date(this.data.get('now')))
        }
        this.data.set('panel', 'DATE')
    },
    selectTime(time) {
        this.fire('select-time', time, false)
    },
    handleClickYear() {
        this.data.set('panel', 'YEAR')
    },
    handleClickMonth() {
        this.data.set('panel', 'MONTH')
    }
})