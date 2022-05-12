const router = require('express').Router()

router.get('/favicon.ico', (req, res) => res.status(204).send())
router.get('/settings', require('./handler-settings'))
router.post('/:tag/:thread_id', require('./handler-post'))
router.get('/:tag/:thread_id', require('./handler-thread'))
router.post('/:tag/', require('./handler-post'))
router.get('/:tag/', require('./handler-board'))
router.get('/', require('./handler-root'))

module.exports = router
