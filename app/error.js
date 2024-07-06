const u = require('./util')
const errorHandler = (err, req, res, next) => {
  const errorsToShow = [SyntaxError, TypeError, ReferenceError]
  for (let i = 0; i < errorsToShow.length; i++) {
    if (err instanceof errorsToShow[i]) {
      console.error(err)
      break
    }
  }
  // From express-js [documentation](http://expressjs.com/en/guide/error-handling.html):
  //
  // > So when you add a custom error handler, you must delegate to the default
  // > Express error handler, when the headers have already been sent to the
  // > client:
  if (res.headersSent) {
    return next(err)
  }
  let errorData
  if (err.isAxiosError) {
    const backendMessage = err.response?.data?.err?.message
    if (backendMessage) {
      try {
        errorData = JSON.stringify(JSON.parse(backendMessage), null, 2)
      } catch (_) {
        errorData = backendMessage
      }
    } else if (err.response?.data) {
      errorData = JSON.stringify(err.response?.data, null, 2)
    }
  } else {
    errorData = err.message
  }
  res.status(err.response?.status || 500)
    .render('error', {
      url: res.locals?.req?.url,
      tag: res.locals?.req?.params?.tag,
      thread_id: res.locals?.req?.params?.thread_id,
      method: res.locals?.req?.method,
      errorCode: err.response?.status || err.code,
      errorData,
      ...req.templatingCommon,
      version: u.versionFromConfig(req.app.locals.config)
    })
}

module.exports = errorHandler
