const router = require('express').Router()

router.post('/:tag/:thread_id', require('./post'))
router.get('/:tag/:thread_id', require('./thread'))
router.post('/:tag/', require('./post'))
router.get('/:tag/', require('./board'))
router.get('/', require('./root'))

module.exports = router
