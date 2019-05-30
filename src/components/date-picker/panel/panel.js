const san = require('san')
const TableDate = require('../base/date')
const TableYear = require('../base/year')
const TableMonth = require('../base/month')
const TableTime = require('../base/time')

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
                    {{ timeHeader }}
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
                    start-at="{{startAt}}"
                    end-at="{{endAt}}"
                    disabled-days="{{disabledDays}}"
                    on-select="selectYear">
                </b-table-year>
                <b-table-month
                    s-if="panel === 'MONTH'"
                    value='{{value}}'
                    type="{{type}}"
                    year='{{year}}'
                    start-at="{{startAt}}"
                    end-at="{{endAt}}"
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
                    start-at="{{startAt}}"
                    end-at="{{endAt}}"
                    not-before="{{notBefore}}"
                    not-after="{{notAfter}}"
                    disabled-days="{{disabledDays}}"
                    first-day-of-week='{{firstDayOfWeek}}'
                    on-select="selectDate">
                </b-table-date>
                <b-table-time
                    s-if="panel === 'TIME'"
                    value="{{value}}"
                    type="{{type}}"
                    minute-step="{{minuteStep}}"
                    on-select="selectTime">
                </b-table-time>
            </div>
        </div>
    `,
    components: {
        'b-table-date': TableDate,
        'b-table-year': TableYear,
        'b-table-month': TableMonth,
        'b-table-time': TableTime
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
            type: 'date',
            visible: false,
            minuteStep: 0
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
            // return this.data.get('value')
            //     ? formatDate(this.data.get('value'), this.data.get('dateFormat'))
            //     : ''
        }
    },
    attached() {
        this.watch('panel', val => {
            if (val === 'YEAR') {
                this.data.set('firstYear', Math.floor(this.data.get('year') / 10) * 10)
            }
        })

        if (this.data.get('visible')) {
            const { value } = this.data.get()
            const date = new Date(value || new Date())
            const year = date.getFullYear()
            const month = date.getMonth()
            this.data.set('year', year, { force: true })
            this.data.set('month', month, { force: true })
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
        this.fire('select-date', date)
    },
    changeYear(year) {
        const { month } = this.data.get()
        this.data.set('year', year)
        this.data.set('month', month)
    },
    changeMonth(month) {
        const { year } = this.data.get()
        this.data.set('year', year)
        this.data.set('month', month)
    },
    selectYear(year) {
        this.changeYear(year)
        this.data.set('panel', 'MONTH')
    },
    selectMonth(month) {
        this.changeMonth(month)
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