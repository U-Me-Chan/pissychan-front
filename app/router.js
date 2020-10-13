const router = require('express').Router()

router.post('/:board_tag/:thread_id', require('./post'))
router.get('/:board_tag/:thread_id', require('./thread'))
router.post('/:board_tag/', require('./post'))
router.get('/:board_tag/', require('./board'))
router.get('/', require('./root'))

module.exports = router
