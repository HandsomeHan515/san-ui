const san = require('san')
const Panel = require('./panel/panel')

const { transformDate, formatDate, transformRange, dateEqual, rangeEqual } = require('../../utils/date')
const { isString } = require('@/utils')

module.exports = san.defineComponent({
    template: `
        <div class='b-datepicker'>
            <div class='b-input-wrapper'>
                <input
                    class="b-input"
                    type="text"
                    autocomplete="off"
                    value="{{text}}"
                    disabled="{{disabled}}"
                    placeholder="{{innerPlaceholder}}"
                    on-focus="handleFocus"
                    on-blur="handleBlur">
                <span
                    s-if="showClearIcon"
                    class="b-input-append"
                    on-click="clearDate">
                    X
                </span>
            </div>
            <div class='b-datepicker-popup' s-if='popupVisible'>
                <b-panel
                    s-if="!range"
                    type="{{innerType}}"
                    date-format="{{innerDateFormat}}"
                    value="{{curVal}}"
                    not-before="{{notBefore}}"
                    not-after="{{notAfter}}"
                    disabled-days="{{disabledDays}}"
                    visible="{{popupVisible}}"
                    on-select-date="selectDate"
                    on-select-time="selectTime">
                </b-panel>
                <div s-else class="b-range-wrapper">
                    <b-panel
                        type="{{innerType}}"
                        date-format="{{innerDateFormat}}"
                        value="{{curVal[0]}}"
                        start-at="{{null}}"
                        end-at="{{curVal[1]}}"
                        not-before="{{notBefore}}"
                        not-after="{{notAfter}}"
                        disabled-days="{{disabledDays}}"
                        visible="{{popupVisible}}"
                        on-select-date="selectStartDate"
                        on-select-time="selectTime">
                    </b-panel>
                    <b-panel
                        type="{{innerType}}"
                        date-format="{{innerDateFormat}}"
                        value="{{curVal[1]}}"
                        start-at="{{curVal[0]}}"
                        end-at="{{null}}"
                        not-before="{{notBefore}}"
                        not-after="{{notAfter}}"
                        disabled-days="{{disabledDays}}"
                        visible="{{popupVisible}}"
                        on-select-date="selectEndDate"
                        on-select-time="selectTime">
                    </b-panel>
                </div>
                <div class="b-datepicker-footer">
                    <span on-click="confirmDate">
                        确定
                    </span>
                </div>
            </div>
        </div>
    `,
    components: {
        'b-panel': Panel
    },
    initData() {
        return {
            popupVisible: false,
            // props:
            value: null,
            type: 'date',
            placeholder: '请选择日期',
            format: 'yyyy-MM-dd',
            disabled: false,
            dateType: 'formatdate'
        }
    },
    computed: {
        curVal() {
            return this.data.get('range') ? [null, null] : null
        },
        transform() {
            const obj = this.data.get('range') ? transformRange : transformDate
            return obj[this.data.get('dateType')]
        },
        text() {
            const transform = this.data.get('transform')
            const value = this.data.get('value')
            const format = this.data.get('format')
            const range = this.data.get('range')
            const date = transform.value2date(value, format)
            if (!range) return date ? formatDate(date, format) : ''

            return Array.isArray(date) && date.length === 2 && date[0] && date[1]
                ? `${formatDate(date[0], format)} ~ ${formatDate(date[1], format)}`
                : ''
        },
        showClearIcon() {
            return !!this.data.get('value')
        },
        innnerDateFormat() {
            const format = this.data.get('format')
            if (format) return format
            return 'yyyy-MM-dd'
        },
        innerPlaceholder() {
            if (!isString(this.data.get('placeholder'))) return
            return this.data.get('placeholder')
        },
        innerType() {
            return String(this.data.get('type')).toLowerCase()
        }
    },
    stringify(date, format = this.data.get('format')) {
        return formatDate(date, format)
    },
    updateDate(confirm = false) {
        const { range, value, curVal, transform, format } = this.data.get()
        const equal = range ? rangeEqual(value, curVal) : dateEqual(value, curVal)
        if (equal) return false

        const date = transform.date2value(curVal, format)
        this.data.set('value', date)
        this.fire('change', date)
        return true
    },
    selectDate(date) {
        this.data.set('curVal', date)
        this.updateDate()
    },
    selectStartDate(date) {
        this.data.set('curVal[0]', date)
        this.updateDate()
    },
    selectEndDate(date) {
        this.data.set('curVal[1]', date)
        this.updateDate()
    },
    selectTime(time, close) {
        this.data.set('curVal', time)
        this.updateDate() && close && this.data.set('popupVisible', false)
    },
    handleFocus(e) {
        if (!this.data.get('popupVisible')) {
            this.data.set('popupVisible', true)
        }
        this.fire('focus', e)
    },
    handleBlur(e) {
        this.fire('blur', e)
    },
    clearDate() {
        const date = this.data.get('range') ? [null, null] : null
        this.data.set('curVal', date)
        this.data.set('value', date)
        this.data.set('popupVisible', false)
        this.fire('clear')
    },
    confirmDate() {
        this.data.set('popupVisible', false)
    }
})