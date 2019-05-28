const san = require('san')
const { DataTypes } = require('san')

const prefixCls = 'b-btn'

module.exports = san.defineComponent({
    template: `
        <button class="{{classes}}" on-click="handleClickLink">
            <span>
                <slot></slot>
            </span>
        </button>
    `,
    dataTypes: {
        disabled: DataTypes.bool,
        type: DataTypes.oneOf(['default', 'primary', 'text', 'info', 'success', 'warning', 'error', 'dashed']),
        shape: DataTypes.oneOf(['circle', 'circle-outline', '']),
        size: DataTypes.oneOf(['small', 'large', 'default']),
        loading: DataTypes.bool,
        icon: DataTypes.string,
        customIcon: DataTypes.string,
        long: DataTypes.bool,
        ghost: DataTypes.bool,
    },
    initData() {
        return {
            showSlot: true,
            // props
            disabled: false,
            type: 'default', // default, primary, dashed, text, info, success, warning, error
            shape: '', // circle, circle-outline
            size: 'default', // small, large, default
            loading: false,
            icon: '',
            customIcon: '',
            long: false,
            ghost: false,
        }
    },
    computed: {
        classes() {
            return [
                `${prefixCls}`,
                `${prefixCls}-${this.data.get('type')}`,
                this.data.get('long') ? `${prefixCls}-long` : ''
                // {
                //     [`${prefixCls}-${this.shape}`]: !!this.shape,
                //     [`${prefixCls}-${this.size}`]: this.size !== 'default',
                //     [`${prefixCls}-loading`]: this.loading != null && this.loading,
                //     [`${prefixCls}-icon-only`]: !this.showSlot && (!!this.icon || !!this.customIcon || this.loading),
                //     [`${prefixCls}-ghost`]: this.ghost
                // }
            ]
        },
        isHrefPattern() {
            return !!this.data.get('to')
        },
        tagName() {
            return this.data.get('isHrefPattern') ? 'a' : 'button'
        }
    },
    handleClickLink(event) {
        this.fire('click', event)
    }
})