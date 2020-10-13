const httpRequestToBackend = require('./http_request')

function renderError (error) {
  return 'Error ' + error.message
}

function hasNonemptyProperty (obj, prop) {
  if (obj === undefined) { return false }
  if (obj[prop] === undefined) { return false }
  if (obj[prop] === '') { return false }
  return true
}

function formatSource (reqBody) {
  let source = '/'
  if (hasNonemptyProperty(reqBody, 'board_name')) {
    source += reqBody.board_name + '/'
  }
  if (hasNonemptyProperty(reqBody, 'thread')) {
    source += reqBody.thread + '/'
  }
  return source
}

function formatQueryObject (reqBody) {
  const query = {}
  if (hasNonemptyProperty(reqBody, 'board_name')) {
    query.board_name = reqBody.board_name
  }
  if (hasNonemptyProperty(reqBody, 'poster')) {
    query.poster = reqBody.poster
  }
  if (hasNonemptyProperty(reqBody, 'subject')) {
    query.subject = reqBody.subject
  }
  if (hasNonemptyProperty(reqBody, 'message')) {
    query.message = reqBody.message
  }
  if (hasNonemptyProperty(reqBody, 'thread')) {
    query.parent_id = reqBody.thread
  }
  return query
}

const postHandler = (req, res) => {
  const postQuery = JSON.stringify(formatQueryObject(req.body))
  const config = req.app.locals.config
  const options = {
    method: 'POST',
    host: config.backend_hostname,
    port: config.backend_port,
    path: '/post',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  httpRequestToBackend(options, postQuery)
    .then((backedResponseBody) => {
      res.redirect(formatSource(req.body))
    })
    .catch((error) => {
      res.send(renderError(error))
    })
}

module.exports = postHandler
