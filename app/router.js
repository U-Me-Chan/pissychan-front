const router = require('express').Router()

router.post('/:board_name/:thread_id', require('./post'))
router.get('/:board_name/:thread_id', require('./thread'))
router.post('/:board_name/', require('./post'))
router.get('/:board_name/', require('./board'))
router.get('/', require('./root'))

module.exports = router
