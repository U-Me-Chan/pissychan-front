const axios = require('axios')
const fmt = require('./format')
const u = require('./util')
const i18n = require('./i18n')

const threadHandler = (req, res) => {
  const config = req.app.locals.config
  const texts = i18n[config.lang]
  const options = {
    baseURL: u.baseURLFromConfig(config),
    headers: { 'User-Agent': config.user_agent }
  }

  Promise.allSettled([
    axios.get('/post/' + req.params.thread_id, options),
    axios.get('/board/all', options)
  ])
    .then((results) => {
      // We don't care much about boards list, hence this promise may fail
      // silently

      const allBoardsRes = results[1]
      const navs = allBoardsRes.status === 'fulfilled'
        ? allBoardsRes.value.data.payload.boards.map(b => `/${b.tag}/`)
        : []

      // We care about fetching board content, hence fail of this promise is
      // unacceptable

      const boardRes = results[0]
      if (boardRes.status !== 'fulfilled') {
        throw new Error(boardRes.reason)
      }

      const thread = boardRes.value.data.payload.thread_data
      const posts = thread.replies

      const formatMessage = config.format_old
        ? fmt.formatMessageOld
        : fmt.formatMessage

      thread.message = formatMessage(thread.message)
      thread.timestamp = fmt.formatTimestamp(thread.timestamp, texts.months)

      posts.forEach((post) => {
        post.message = fmt.formatMessage(post.message)
        post.timestamp = fmt.formatTimestamp(post.timestamp, texts.months)
      })

      res.render('thread', {
        tag: req.params.tag,
        thread,
        navs,
        posts,
        texts
      })
    })
    .catch(error => res.send(error.stack))
}

module.exports = threadHandler
