const san = require('san')
const Panel = require('./panel/panel')

const { transformDate, isValidDate } = require('../../utils/date')
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
                    type="{{innerType}}"
                    date-format="{{innerDateFormat}}"
                    value="{{value}}"
                    not-before="{{notBefore}}"
                    not-after="{{notAfter}}"
                    disabled-days="{{disabledDays}}"
                    visible="{{popupVisible}}"
                    on-select-date="selectDate"
                    on-select-time="selectTime">
                </b-panel>
            </div>
            <div class="b-datepicker-footer">
                <b-button on-click="confirmDate">
                    确定
                </b-button>
            </div>
        </div>
    `,
    components: {
        'b-panel': Panel
    },
    initData() {
        const _date = new Date().getTime()
        const preDate = new Date(_date - (3600 * 1000 * 24))
        const nextDate = new Date(_date + (3600 * 1000 * 24))

        return {
            rili: new Date().getDate(),
            popupVisible: false,
            // props:
            text: null,
            value: null,
            type: 'date',
            placeholder: '请选择日期',
            format: 'HH:mm:ss',
            // format: 'yyyy-MM-dd',
            disabled: false,
            notBefore: new Date(),
            // notAfter: nextDate,
            // disabledDays: [preDate, new Date(), nextDate]
        }
    },
    computed: {
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
    selectDate(date) {
        const value = transformDate.formatdate.date2value(date, this.data.get('innnerDateFormat'))
        this.data.set('value', date)
        this.data.set('text', value)
        this.data.set('popupVisible', false)
        this.fire('change', value)
    },
    selectTime(time, close) {
        const value = transformDate.formatdate.date2value(time, this.data.get('innnerDateFormat'))
        this.data.set('value', time)
        this.data.set('text', value)
        close && this.data.set('popupVisible', false)
        this.fire('change', value)
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
        this.data.set('value', null)
        this.data.set('text', null)
        this.data.set('popupVisible', false)
    },
    confirmDate() {
        this.data.set('popupVisible', false)
    }
})