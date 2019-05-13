const { isArray } = require('@/utils')

function getCriticalTime(value, type = 'date') {
    if (!value) return null

    const date = new Date(value)
    switch (type) {
        case 'year':
            return new Date(date.getFullYear(), 0).getTime()
        case 'month':
            return new Date(date.getFullYear(), date.getMonth()).getTime()
        case 'date':
            return date.setHours(0, 0, 0, 0)
        default:
            return date.getTime()
    }
}

function inBefore(time, notBefore, startAt) {
    const notBeforeTime = getCriticalTime(notBefore)
    return (notBeforeTime && time < notBeforeTime) || (startAt && time < getCriticalTime(startAt))
}
function inAfter(time, notAfter, endAt) {
    const notAfterTime = getCriticalTime(notAfter)
    return (notAfterTime && time > notAfterTime) || (endAt && time > getCriticalTime(endAt))
}
function inDisabledDays(time, disabledDays) {
    if (!isArray(disabledDays)) return false

    return disabledDays.some(v => getCriticalTime(v) === time)
}

module.exports = {
    months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    weeks: ['日', '一', '二', '三', '四', '五', '六'],
    getCriticalTime,
    inBefore,
    inAfter,
    inDisabledDays
}