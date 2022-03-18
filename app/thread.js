const axios = require('axios')
const fmt = require('./format')
const u = require('./util')
const i18n = require('./i18n')

const threadHandler = (req, res) => {
  const config = req.app.locals.config
  const texts = i18n[config.lang]
  const options = {
    baseURL: u.baseURLFromConfig(config),
    headers: { 'User-Agent': u.versionFromConfig(config) }
  }

  Promise.allSettled([
    axios.get('/post/' + req.params.thread_id, options),
    axios.get('/board/all', options)
  ])
    .then((results) => {
      // We don't care much about boards list, hence this promise may fail
      // silently

      const allBoardsRes = results[1]
      const allBoards = allBoardsRes.status === 'fulfilled'
        ? allBoardsRes.value.data.payload.boards
        : []
      const navs = allBoards.map(b => `/${b.tag}/`)

      // We care about fetching thread content, hence fail of this promise is
      // unacceptable

      const threadRes = results[0]
      if (threadRes.status !== 'fulfilled') {
        throw new Error(threadRes.reason)
      }

      const thread = threadRes.value.data.payload.thread_data
      const posts = thread.replies
      const { name: boardName, tag } = allBoards.find((b) => b.id === thread.board_id) ||
        { name: null, tag: req.params.tag }

      const formatMessage = config.format_old
        ? fmt.formatMessageOld
        : fmt.formatMessage

      thread.message = formatMessage(thread.message)
      thread.timestamp = fmt.formatTimestamp(thread.timestamp, texts.months)

      posts.forEach((post) => {
        post.message = formatMessage(post.message)
        post.timestamp = fmt.formatTimestamp(post.timestamp, texts.months)
      })

      res.render(thread.parent_id ? 'freestanding_post' : 'thread', {
        tag,
        boardName,
        thread,
        navs,
        posts,
        texts,
        version: u.versionFromConfig(config)
      })
    })
    .catch(error => res.send(error.stack))
}

module.exports = threadHandler
