const axios = require('axios')
const u = require('./util')

const createHandler = (isDelete) => async (req, res, next) => {
  const strId = String(req.body.id).trim()
  const id = parseInt(strId)
  const nonNumericRegex = /[^0-9]/g
  if (nonNumericRegex.test(strId) || isNaN(id)) {
    return next(new u.HttpError(400, 'Provided post ID is not a valid number'))
  }
  const password = req.postsPasswords.get(id)
  if (password === undefined || password === null) {
    return next(new u.HttpError(400, 'There is no password available for specified post ID'))
  }
  if (isDelete) {
    await axios.delete(`${req.app.locals.config.backend_path}/v2/post/${id}?password=${password}`)
  }
  req.postsPasswords.delete(id)
  const yearMs = 1000 * 60 * 60 * 24 * 365
  const expectedEncodedLenMax = 4096 - 'post_passwords'.length
  const postsPaswordsCookie = req.postsPasswords.render(
    expectedEncodedLenMax, encodeURIComponent)
  if (!postsPaswordsCookie.length) {
    res.clearCookie('post_passwords').redirect(`/post/${id}`)
  } else {
    res
      .cookie('post_passwords', postsPaswordsCookie, { maxAge: yearMs })
      .redirect(`/post/${id}`)
  }
}

module.exports = {
  delete: createHandler(true),
  forget: createHandler(false)
}
