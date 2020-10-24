const axios = require('axios')
const u = require('./util')

function hasNonemptyProperty (obj, prop) {
  if (obj === undefined) { return false }
  if (obj[prop] === undefined) { return false }
  if (obj[prop] === '') { return false }
  return true
}

function formatSource (reqBody) {
  let source = '/'
  if (hasNonemptyProperty(reqBody, 'tag')) {
    source += reqBody.tag + '/'
  }
  if (hasNonemptyProperty(reqBody, 'thread')) {
    source += reqBody.thread + '/'
  }
  return source
}

function formatQueryObject (reqBody) {
  const query = {}
  if (hasNonemptyProperty(reqBody, 'tag')) {
    query.tag = reqBody.tag
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
  if (hasNonemptyProperty(reqBody, 'sage')) {
    query.sage = true
  }
  return query
}

const postHandler = (req, res) => {
  const config = req.app.locals.config
  const options = {
    baseURL: u.baseURLFromConfig(config),
    headers: { 'User-Agent': config.user_agent }
  }

  axios.post('/post', formatQueryObject(req.body), options)
    .then(
      _ => res.redirect(formatSource(req.body)),
      backRes => res.send(backRes.message))
    .catch(error => res.send(error.stack))
}

module.exports = postHandler
