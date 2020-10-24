const axios = require('axios')
const htmlDefuse = require('./html_defuse')
const fmt = require('./format')
const u = require('./util')

const threadHandler = (req, res) => {
  const config = req.app.locals.config
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

      thread.message = fmt.formatMessage(htmlDefuse(thread.message))
      thread.timestamp = fmt.formatTimestamp(thread.timestamp)

      posts.forEach((post) => {
        post.message = fmt.formatMessage(htmlDefuse(post.message))
        post.timestamp = fmt.formatTimestamp(post.timestamp)
      })

      res.render('thread', {
        tag: req.params.tag,
        thread,
        navs,
        posts
      })
    })
    .catch(error => res.send(error.stack))
}

module.exports = threadHandler
