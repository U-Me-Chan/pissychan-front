const axios = require('axios')
const { formatMessage, formatTimestamp } = require('./format')

const boardHandler = async (req, res, next) => {
  const config = req.app.locals.config
  const limit = req.query.limit || 20
  const offset = req.query.offset || 0
  const tag = req.params.tag
  const ver = config.apiv2 === true ? '/v2' : ''
  const result = await axios.get(
    `${config.backend_path}${ver}/board/${tag}/?limit=${limit}&offset=${offset}`)
  let boardName
  let threads
  let count = 0
  if (config.apiv2 === true) {
    const payload = result.data.payload
    count = payload.count
    threads = payload.posts
    const boardNames = []
    tag.split('+').forEach(t => {
      const board = req.allBoards.find(b => b.tag === t)
      if (board) {
        boardNames.push(board.name)
      }
    })
    boardName = boardNames.join(', ')
  } else {
    const board = result.data.payload.board_data
    boardName = board.name
    threads = board.threads
    count = board.threads_count
  }
  const pages = Array.from({ length: Math.ceil(count / limit) }, (v, i) => i)
  const texts = req.app.locals.texts
  threads.forEach((post) => {
    post.message = formatMessage(post.message)
    post.timestamp = formatTimestamp(post.timestamp, texts.months)
    post.repliesCount = post.replies_count
    if (config.apiv2 === true) {
      post.tag = post.board.tag
    } else {
      post.tag = tag
    }
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
