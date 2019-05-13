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
                    value="{{value}}"
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
                    on-select-date="selectDate">
                </b-panel>
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
            value: null,
            placeholder: '请选择日期',
            format: 'yyyy-MM-dd',
            disabled: false,
            notBefore: new Date(),
            notAfter: nextDate,
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
        this.data.set('value', value)
        this.data.set('popupVisible', false)
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
        this.data.set('value', '')
        this.data.set('popupVisible', false)
    },
})