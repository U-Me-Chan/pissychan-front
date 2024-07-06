const axios = require('axios')
const { formatMessage, formatTimestamp } = require('./format')

const boardHandler = async (req, res, next) => {
  const config = req.app.locals.config
  const limit = req.query.limit || 20
  const offset = req.query.offset || 0
  const result = await axios.get(
    `${config.backend_path}/board/` + req.params.tag + '/?limit=' + limit + '&offset=' + offset)
  const board = result.data.payload.board_data
  const threads = board.threads
  const count = board.threads_count
  const pages = Array.from({ length: Math.ceil(count / limit) }, (v, i) => i)
  const texts = req.app.locals.texts

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
    pages
  })
}

module.exports = boardHandler
