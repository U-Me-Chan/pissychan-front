const router = require('express').Router()

router.use('/:board_name/', require('./board'))

module.exports = router
