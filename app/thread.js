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

  axios.get('/post/' + req.params.thread_id, options)
    .then((backRes) => {
      const thread = backRes.data.payload.thread_data
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
        posts
      })
    }, backRes => res.send(backRes.message))
    .catch(error => res.send(error.stack))
}

module.exports = threadHandler
