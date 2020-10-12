const router = require('express').Router()

router.use('/:board_name/:thread_id', require('./thread'))
router.use('/:board_name/', require('./board'))
router.use('/', require('./root'))

module.exports = router
