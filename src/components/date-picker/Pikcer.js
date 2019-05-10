const san = require('san')
const Panel = require('./panel/panel')

const { transformDate, isValidDate } = require('../../utils/date')

module.exports = san.defineComponent({
    template: `
        <div class='b-datepicker'>
            <div class='b-input-wrapper' on-click="showPopup">
                <input
                    class="b-input"
                    type="text"
                    autocomplete="off"
                    value="{{curVal}}"
                    placeholder="{{innerPlaceholder}}"
                    on-keydown="handleKeydown"
                    on-focus="handleFocus"
                    on-blur="handleBlur"
                    on-change="handleChange">
                <span
                    s-if="showClearIcon"
                    class="b-input-append"
                    on-click="clearDate">
                    &#967;
                </span>
            </div>
            <div class='b-datepicker-popup' s-if='popupVisible'>
                <b-panel
                    type="{{innerType}}"
                    date-format="{{innerDateFormat}}"
                    value="{{curVal}}"
                    visible="{{popupVisible}}"
                    on-select-date="selectDate"
                    on-select-time="selectTime">
                </b-panel>
            </div>
        </div>
    `,
    components: {
        'b-panel': Panel
    },
    initData() {
        return {
            rili: new Date().getDate(),
            curVal: null,
            format: '',
            popupVisible: false
        }
    },
    computed: {
        innnerDateFormat() {
            if (this.data.get('format')) return this.data.get('format')
            return 'yyyy-MM-dd'
        },
        showClearIcon() {

            return !!this.data.get('curVal')
        },
        innerIcon() {
            return this.data.get('curVal') ? '' : ''
        }
    },
    selectDate(date) {
        const value = transformDate.formatdate.date2value(date, this.data.get('innnerDateFormat'))
        this.data.set('curVal', value)
        this.data.set('popupVisible', false)
        this.fire('on-change', this.curVal)
    },
    handleFocus(e) {
        if (!this.data.get('popupVisible')) {
            this.data.set('popupVisible', true)
        }
        this.fire('focus', e)
    },
    clearDate() {
        this.data.set('curVal', '')
    }
})