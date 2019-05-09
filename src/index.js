const router = require('san-router').router
const MyApp = require('./components/Todo')
const Year = require('./components/date-picker/base/year')
const Month = require('./components/date-picker/base/month')
const Date = require('./components/date-picker/base/date')

router.add({ rule: '/', Component: MyApp, target: '#app' })
router.add({ rule: '/year', Component: Year, target: '#app' })
router.add({ rule: '/month', Component: Month, target: '#app' })
router.add({ rule: '/date', Component: Date, target: '#app' })

router.start()
