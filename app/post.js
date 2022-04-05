const axios = require('axios')
const u = require('./util')
const FormData = require('form-data')
const fs = require('fs')

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
  query.poster = reqBody.oaoao || undefined
  query.subject = reqBody.mmmmm || undefined
  query.message = reqBody.zzzzz || undefined
  query.parent_id = reqBody.thread || undefined
  query.sage = reqBody.sage || undefined
  return query
}

function sendPost (req, res, data) {
  const config = req.app.locals.config
  const options = {
    baseURL: u.baseURLFromConfig(config),
    headers: { 'User-Agent': u.versionFromConfig(config) }
  }

  axios.post('/post', data, options).then(
    _ => res.redirect(formatSource(req.body)),
    backRes => res.send(backRes.message)
  ).catch(error => res.send(error.stack))
}

const postHandler = (req, res) => {
  if (req.body.name || req.body.link) {
    res.redirect(formatSource(req.body))
    return
  }
  if (req.body.message === '' && !req.files) {
    res.send('Выберите изображение или заполните сообщение поста')
    return
  }
  if (req.files) {
    const form = new FormData()

    form.append('image', fs.createReadStream(req.files.usuc.tempFilePath), req.files.usuc.name)

    axios.post('/', form, {
      baseURL: u.filestoreURLFromConfig(req.app.locals.config),
      headers: form.getHeaders()
    }).then(result => {
      fs.rm(req.files.usuc.tempFilePath, () => {})
      const orig = result.data.original_file
      const thmb = result.data.thumbnail_file
      const markedImage = `[![](${thmb})](${orig})`

      const query = formatQueryObject(req.body)
      query.message = query.message ? query.message + '\n' + markedImage : markedImage

      sendPost(req, res, query)
    }).catch(error => res.send(error.stack))
  } else {
    sendPost(req, res, formatQueryObject(req.body))
  }
}

module.exports = postHandler
