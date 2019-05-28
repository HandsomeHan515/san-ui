const router = require('san-router').router
require('./styles')
const MyApp = require('./components/Todo')
const Year = require('./components/date-picker/base/year')
const Month = require('./components/date-picker/base/month')
const Date = require('./components/date-picker/base/date')
const Panel = require('./components/date-picker/panel/panel')
const Picker = require('./components/date-picker/Pikcer')
const Button = require('./components/button/Button')

router.add({ rule: '/', Component: MyApp, target: '#app' })
router.add({ rule: '/year', Component: Year, target: '#app' })
router.add({ rule: '/month', Component: Month, target: '#app' })
router.add({ rule: '/date', Component: Date, target: '#app' })
router.add({ rule: '/panel', Component: Panel, target: '#app' })
router.add({ rule: '/picker', Component: Picker, target: '#app' })
router.add({ rule: '/button', Component: Button, target: '#app' })

router.start()
