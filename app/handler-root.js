const axios = require('axios')
const { formatMessage, formatTimestamp } = require('./format')
const u = require('./util')

const rootHandler = (req, res) => {
  const config = req.app.locals.config
  const options = {
    baseURL: u.baseURLFromConfig(config),
    headers: { 'User-Agent': u.versionFromConfig(config) }
  }

  axios.get('/board/all', options)
    .then((backRes) => {
      const posts = backRes.data.payload.posts
      const boards = backRes.data.payload.boards

      posts.forEach((post) => {
        post.message = formatMessage(post.message)
        post.timestamp = formatTimestamp(post.timestamp, req.templatingCommon.texts.months)
      })

      res.render('root', {
        boards,
        posts,
        ...req.templatingCommon,
        version: u.versionFromConfig(config)
      })
    }, backRes => {
      const errorData = backRes.response?.data?.error?.message ||
        JSON.stringify(backRes.response?.data)
      res.status(backRes.response?.status || 500)
        .render('root_error', {
          errorCode: backRes.response?.status || backRes.code,
          errorData,
          ...req.templatingCommon,
          version: u.versionFromConfig(config)
        })
    })
    .catch(error => {
      console.error(error.stack)
      res.status(500).send(error.stack)
    })
}

module.exports = rootHandler
