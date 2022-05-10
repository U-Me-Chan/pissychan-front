const axios = require('axios')
const { formatMessage, formatTimestamp } = require('./format')
const u = require('./util')
const i18n = require('./i18n')

const rootHandler = (req, res) => {
  const config = req.app.locals.config
  const texts = i18n[config.lang]
  const options = {
    baseURL: u.baseURLFromConfig(config),
    headers: { 'User-Agent': u.versionFromConfig(config) }
  }
  const themeUrl = u.buildThemeUrl(config, req.cookies.theme || undefined)

  axios.get('/board/all', options)
    .then((backRes) => {
      const posts = backRes.data.payload.posts
      const boards = backRes.data.payload.boards
      const navs = boards.map(b => `/${b.tag}/`)

      posts.forEach((post) => {
        post.message = formatMessage(post.message)
        post.timestamp = formatTimestamp(post.timestamp, texts.months)
      })

      res.render('root', {
        navs,
        themeUrl,
        boards,
        posts,
        texts,
        version: u.versionFromConfig(config)
      })
    }, backRes => {
      const errorData = backRes.response?.data?.error?.message ||
        JSON.stringify(backRes.response?.data)
      res.status(backRes.response?.status || 500)
        .render('root_error', {
          errorCode: backRes.response?.status || backRes.code,
          errorData,
          themeUrl,
          texts,
          version: u.versionFromConfig(config)
        })
    })
    .catch(error => {
      console.error(error.stack)
      res.status(500).send(error.stack)
    })
}

module.exports = rootHandler
