const { router } = require('san-router')
const MyApp = require('./components/Todo')

router.add({ rule: '/', Component: MyApp, target: '#app' })

router.start()
