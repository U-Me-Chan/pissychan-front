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
      const texts = req.templatingCommon.texts
      const { name: boardName, tag } = req.allBoards.find((b) => b.id === thread.board_id) ||
        { name: null, tag: req.params.tag }

      const neighbors = [thread.id, ...posts.map(p => p.id)]
      thread.message = formatMessage(thread.message, neighbors, texts.crossThreadLinkSuffix)
      thread.timestamp = formatTimestamp(thread.timestamp, texts.months)
      thread.repliesCount = thread.replies.length // For consistent rendering

      posts.forEach((post) => {
        post.message = formatMessage(post.message, neighbors, texts.crossThreadLinkSuffix)
        post.timestamp = formatTimestamp(post.timestamp, texts.months)
      })

      const isFreestanding = Boolean(thread.parent_id)
      const postingMode = {
        forbidden: isFreestanding,
        text: isFreestanding ? texts.posting_mode_forbidden : texts.posting_mode_reply
      }
      res.render('thread', {
        tag,
        boardName,
        postingMode,
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
