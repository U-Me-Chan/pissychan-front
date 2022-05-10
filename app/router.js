const router = require('express').Router()

router.get('/favicon.ico', (req, res) => res.status(204).send())
router.get('/settings', require('./settings'))
router.post('/:tag/:thread_id', require('./post'))
router.get('/:tag/:thread_id', require('./thread'))
router.post('/:tag/', require('./post'))
router.get('/:tag/', require('./board'))
router.get('/', require('./root'))

module.exports = router
