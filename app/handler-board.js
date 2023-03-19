const axios = require('axios')
const { formatMessage, formatTimestamp } = require('./format')
const u = require('./util')

const boardHandler = (req, res) => {
  const config = req.app.locals.config
  const options = {
    baseURL: u.baseURLFromConfig(config),
    headers: { 'User-Agent': u.versionFromConfig(config) }
  }
  const limit = req.query.limit || 20
  const offset = req.query.offset || 0

  axios.get(`${config.backend_path}/board/` + req.params.tag + '/?limit=' + limit + '&offset=' + offset, options)
    .then((result) => {
      const board = result.data.payload.board_data
      const threads = board.threads
      const count = board.threads_count
      const pages = Array.from({ length: Math.ceil(count / limit) }, (v, i) => i)
      const texts = req.templatingCommon.texts

      threads.forEach((post) => {
        post.message = formatMessage(post.message)
        post.timestamp = formatTimestamp(post.timestamp, texts.months)
        post.repliesCount = post.replies_count
        post.tag = board.tag
        post.password = req.postsPasswords.get(post.id)
      })

      res.render('board', {
        tag: board.tag,
        boardName: board.name,
        postingMode: { text: texts.posting_mode_post },
        threads,
        offset,
        limit,
        pages,
        ...req.templatingCommon,
        version: u.versionFromConfig(config)
      })
    }, (result) => {
      const errorData = result.response?.data?.error?.message ||
        JSON.stringify(result.response?.data)
      res.status(result.response?.status || 500)
        .render('board_error', {
          tag: req.params.tag,
          errorCode: result.response?.status || result.code,
          errorData,
          ...req.templatingCommon,
          version: u.versionFromConfig(config)
        })
    })
    .catch(error => {
      console.error(error.stack)
      res.status(500).send(error.stack)
    })
}

module.exports = boardHandler
