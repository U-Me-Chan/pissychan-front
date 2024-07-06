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

async function sendPost (req, res, next, data) {
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
  const result = await axios({ url, method, data })
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
}

const postHandler = async (req, res, next) => {
  if (req.body.name || req.body.link) {
    return res.redirect(formatSource(req.body))
  }
  if (req.body.message === '' && !req.files) {
    throw new u.HttpError(400, 'Выберите изображение или заполните сообщение поста')
  }
  const query = formatQueryObject(req.body)
  if (req.files) {
    const form = new FormData()

    form.append('image', fs.createReadStream(req.files.usuc.tempFilePath), req.files.usuc.name)

    const config = req.app.locals.config
    // Note: no trailing slash. See https://github.com/U-Me-Chan/umechan/issues/13
    const result = await axios.post(
      `${config.filestore_path}`, form, { headers: form.getHeaders() })
    fs.rm(req.files.usuc.tempFilePath, () => {})
    const orig = result.data.original_file
    const thmb = result.data.thumbnail_file
    const markedImage = `[![](${thmb})](${orig})`

    query.message = query.message ? query.message + '\n' + markedImage : markedImage
  }
  await sendPost(req, res, next, query)
}

module.exports = postHandler
