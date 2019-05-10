const fecha = require('./fecha')

function formatDate(date, format) {
    try {
        return fecha.format(new Date(date), format)
    } catch (e) {
        return ''
    }
}

function parseDate(str, format) {
    try {
        return fecha.parse(str, format)
    } catch (e) {
        return null
    }
}

function isDateObject(value) {
    return value instanceof Date
}

function isValidDate(date) {
    if (date === null || date === undefined) {
        return false
    }
    return !isNaN(new Date(date).getTime())
}

const transformDate = {
    date: {
        value2date: val => isValidDate(val) ? new Date(val) : null,
        date2value: date => date
    },
    timestamp: {
        value2date: val => isValidDate(val) ? new Date(val) : null,
        date2value: date => isValidDate(date) ? new Date(date).getTime() : null
    },
    formatdate: {
        value2date: parseDate,
        date2value: (date, format) => isValidDate(date) ? formatDate(date, format) : null
    }
}

module.exports = {
    formatDate,
    parseDate,
    isDateObject,
    isValidDate,
    transformDate
}