const axios = require('axios')
const { formatMessage, formatTimestamp } = require('./format')

const boardHandler = async (req, res, next) => {
  const config = req.app.locals.config
  const limit = req.query.limit || 20
  const offset = req.query.offset || 0
  const tag = req.params.tag
  const result = await axios.get(
    `${config.backend_path}/v2/board/${tag}/?limit=${limit}&offset=${offset}`)
  const payload = result.data.payload
  const count = payload.count
  const threads = payload.posts
  const boardNames = []
  tag.split('+').forEach(t => {
    const board = req.allBoards.find(b => b.tag === t)
    if (board) {
      boardNames.push(board.name)
    }
  })
  const boardName = boardNames.join(', ')
  const pages = Array.from({ length: Math.ceil(count / limit) }, (v, i) => i)
  const texts = req.app.locals.texts
  threads.forEach((post) => {
    post.message = formatMessage(post.message)
    post.timestamp = formatTimestamp(post.timestamp, texts.months)
    post.repliesCount = post.replies_count
    post.tag = post.board.tag
    post.password = req.postsPasswords.get(post.id)
  })
  // It is possible to navigate to e.g. "/pic+cul/" and post a thread there. So
  // we have to chose where the message will go and it will be the board of the
  // first tag in a list.
  const firstTag = tag.split('+')[0]
  const postingMode = { text: texts.posting_mode_post + ` /${firstTag}/` }
  const boardMixed = tag.split('+').length > 1
  res.render('board', { tag, boardName, postingMode, threads, offset, limit, pages, boardMixed })
}

module.exports = boardHandler
