const axios = require('axios')
const htmlDefuse = require('./html_defuse')
const fmt = require('./format')
const u = require('./util')
const i18n = require('./i18n')

const rootHandler = (req, res) => {
  const config = req.app.locals.config
  const texts = i18n[config.lang]
  const options = {
    baseURL: u.baseURLFromConfig(config),
    headers: { 'User-Agent': config.user_agent }
  }

  axios.get('/board/all', options)
    .then((backRes) => {
      const posts = backRes.data.payload.posts
      const boards = backRes.data.payload.boards
      const navs = boards.map(b => `/${b.tag}/`)

      posts.forEach((post) => {
        post.message = fmt.formatMessage(htmlDefuse(post.message))
        post.timestamp = fmt.formatTimestamp(post.timestamp, texts.months)
      })

      res.render('root', {
        navs,
        boards,
        posts,
        texts
      })
    }, backRes => res.send(backRes.message))
    .catch(error => res.send(error.stack))
}

module.exports = rootHandler
