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
  const yearMs = 1000 * 60 * 60 * 24 * 365
  let url = `${config.backend_path}/post`
  let method = 'post'
  if (config.apiv2 === true) {
    url = `${config.backend_path}/v2/post/`
    if (data.parent_id !== undefined) {
      url += `${data.parent_id}/`
      method = 'put'
    }
  }
  const options = {
    url,
    method,
    data,
    baseURL: u.baseURLFromConfig(config),
    headers: { 'User-Agent': u.versionFromConfig(config) }
  }
  console.log(options)
  axios(options).then(
    result => {
      if (req.postsPasswords.savingEnabled) {
        if (typeof result.data === 'object' && typeof result.data.payload === 'object') {
          req.postsPasswords.set(result.data.payload.post_id, result.data.payload.password)
        }
      }
      const expectedEncodedLenMax = 4096 - 'post_passwords'.length
      const postsPaswordsCookie = req.postsPasswords.render(
        expectedEncodedLenMax, encodeURIComponent)
      if (!postsPaswordsCookie.length) {
        res.clearCookie('post_passwords').redirect(formatSource(req.body))
      } else {
        res
          .cookie('post_passwords', postsPaswordsCookie, { maxAge: yearMs })
          .redirect(formatSource(req.body))
      }
    },
    result => {
      const errorData = result.response?.data?.error?.message ||
          JSON.stringify(result.response?.data)
      const errorCode = result.response?.status || 500
      res.status(errorCode)
        .render('post_error', {
          tag: req.params.tag,
          thread_id: req.params.thread_id,
          method,
          errorCode,
          errorData,
          ...req.templatingCommon,
          version: u.versionFromConfig(config)
        })
    }
  ).catch(error => res.send(error.stack))
}

const postHandler = (req, res) => {
  if (req.body.name || req.body.link) {
    res.redirect(formatSource(req.body))
    return
  }
  if (req.body.message === '' && !req.files) {
    // TODO render proper error page
    res.send('Выберите изображение или заполните сообщение поста')
    return
  }
  if (req.files) {
    const form = new FormData()

    form.append('image', fs.createReadStream(req.files.usuc.tempFilePath), req.files.usuc.name)

    const config = req.app.locals.config
    // Note: no trailing slash. See https://github.com/U-Me-Chan/umechan/issues/13
    axios.post(`${config.filestore_path}`, form, {
      baseURL: u.filestoreBaseURLFromConfig(config),
      headers: form.getHeaders()
    }).then(result => {
      fs.rm(req.files.usuc.tempFilePath, () => {})
      const orig = result.data.original_file
      const thmb = result.data.thumbnail_file
      const markedImage = `[![](${thmb})](${orig})`

      const query = formatQueryObject(req.body)
      query.message = query.message ? query.message + '\n' + markedImage : markedImage

      sendPost(req, res, query)
    }).catch(error => res.status(500).send(error.stack)) // TODO render proper error page
  } else {
    sendPost(req, res, formatQueryObject(req.body))
  }
}

module.exports = postHandler
