const axios = require('axios')
const { formatMessage, formatTimestamp } = require('./format')
const u = require('./util')

const threadHandler = (req, res) => {
  const config = req.app.locals.config
  const options = {
    baseURL: u.baseURLFromConfig(config),
    headers: { 'User-Agent': u.versionFromConfig(config) }
  }

  Promise.allSettled([
    axios.get('/post/' + req.params.thread_id, options)
  ])
    .then((results) => {
      const threadRes = results[0]
      if (threadRes.status !== 'fulfilled') {
        const errorData = threadRes.reason.response?.data?.error?.message ||
          JSON.stringify(threadRes.reason.response?.data)
        const errorCode = threadRes.reason.response?.status ||
          threadRes.reason.code
        res.status(threadRes.reason.response?.status || 500)
          .render('thread_error', {
            tag: req.params.tag,
            thread_id: req.params.thread_id,
            errorCode,
            errorData,
            ...req.templatingCommon,
            version: u.versionFromConfig(config)
          })
        return
      }

      const thread = threadRes.value.data.payload.thread_data
      const posts = thread.replies
      const { name: boardName, tag } = req.allBoards.find((b) => b.id === thread.board_id) ||
        { name: null, tag: req.params.tag }

      thread.message = formatMessage(thread.message)
      thread.timestamp = formatTimestamp(thread.timestamp, req.templatingCommon.texts.months)
      thread.repliesCount = thread.replies.length // For consistent rendering

      posts.forEach((post) => {
        post.message = formatMessage(post.message)
        post.timestamp = formatTimestamp(post.timestamp, req.templatingCommon.texts.months)
      })

      res.render(thread.parent_id ? 'freestanding_post' : 'thread', {
        tag,
        boardName,
        thread,
        posts,
        ...req.templatingCommon,
        version: u.versionFromConfig(config)
      })
    })
    .catch(error => {
      console.error(error.stack)
      res.status(500).send(error.stack)
    })
}

module.exports = threadHandler
