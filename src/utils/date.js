const fecha = require('./fecha')

module.exports = {
    formatDate: function (date, format) {
        try {
            return fecha.format(new Date(date), format)
        } catch (e) {
            return ''
        }
    }
}