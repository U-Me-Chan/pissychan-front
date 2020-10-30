const axios = require('axios')
const u = require('./util')

function formatSource (reqBody) {
  let source = '/'
  if (reqBody.tag) {
    source += reqBody.tag + '/'
  }
  if (reqBody.thread) {
    source += reqBody.thread + '/'
  }
  return source
}

function formatQueryObject (reqBody) {
  const query = {}
  query.tag = reqBody.tag || undefined
  query.poster = reqBody.poster || undefined
  query.subject = reqBody.subject || undefined
  query.message = reqBody.message || undefined
  query.parent_id = reqBody.thread || undefined
  query.sage = reqBody.sage || undefined
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
