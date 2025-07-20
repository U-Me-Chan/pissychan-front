const axios = require('axios')
const { formatMessage, formatTimestamp } = require('./format')

const threadHandler = async (req, res, next) => {
  const config = req.app.locals.config
  const result = await axios.get(`${config.backend_path}/v2/post/${req.params.thread_id}`)
  let allBoards = []
  if (result.data.payload.boards) {
    allBoards = result.data.payload.boards
    req.app.locals.navs = allBoards.map(b => `/${b.tag}/`)
  }
  const thread = result.data.payload.thread_data
  const posts = thread.replies
  const texts = req.app.locals.texts
  const { name: boardName, tag } = allBoards.find((b) => b.id === thread.board_id) ||
    { name: null, tag: req.params.tag }
  thread.message = formatMessage(thread.message)
  thread.timestamp = formatTimestamp(thread.timestamp, texts.months)
  thread.repliesCount = thread.replies.length // For consistent rendering
  thread.password = req.postsPasswords.get(thread.id)
  thread.tag = tag
  posts.forEach((post) => {
    post.message = formatMessage(post.message)
    post.timestamp = formatTimestamp(post.timestamp, texts.months)
    post.tag = tag
    post.password = req.postsPasswords.get(post.id)
  })
  const isFreestanding = Boolean(thread.parent_id)
  const postingMode = {
    forbidden: isFreestanding,
    delete: req.query.action === 'delete',
    forget: req.query.action === 'forget',
    text: req.query.action === 'delete'
      ? texts.posting_mode_delete
      : req.query.action === 'forget'
        ? texts.posting_mode_forget
        : isFreestanding
          ? texts.posting_mode_forbidden
          : texts.posting_mode_reply
  }
  res.render('thread', { tag, boardName, postingMode, thread, posts })
}

module.exports = threadHandler
