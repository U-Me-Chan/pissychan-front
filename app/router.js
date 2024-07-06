const router = require('express').Router()

const wrapAsync = (handler) => async (req, res, next) => {
  // These locals are used to construct error page in the global error handler,
  // since the request data is no more available at the error handling stage.
  res.locals = { req: { url: req.url, params: req.params, query: req.query, method: req.method } }
  try {
    await handler(req, res, next)
  } catch (err) {
    return next(err)
  }
}

router.get('/favicon.ico', (req, res) => res.status(204).send())
router.get('/settings', wrapAsync(require('./handler-settings')))
router.post('/delete', wrapAsync(require('./handler-delete-forget').delete))
router.post('/forget', wrapAsync(require('./handler-delete-forget').forget))
router.post('/:tag/:thread_id', wrapAsync(require('./handler-post')))
router.get('/:tag/:thread_id', wrapAsync(require('./handler-thread')))
router.post('/:tag/', wrapAsync(require('./handler-post')))
router.get('/:tag/', wrapAsync(require('./handler-board')))
router.get('/', wrapAsync(require('./handler-root')))

module.exports = router
