const axios = require('axios')
const { formatMessage, formatTimestamp } = require('./format')
const u = require('./util')

const rootHandler = (req, res) => {
  const config = req.app.locals.config
  const options = {
    baseURL: u.baseURLFromConfig(config),
    headers: { 'User-Agent': u.versionFromConfig(config) }
  }
  const limit = req.query.limit || 20
  const offset = req.query.offset || 0

  axios.get('/board/all/' + '?limit=' + limit + '&offset=' + offset, options)
    .then((backRes) => {
      const posts = backRes.data.payload.posts
      const boards = backRes.data.payload.boards
      // Since no info about posts count on feed provided by the backend,
      // just assume here that there always is a span of 5 pages.
      const pagesCount = 5
      const currentPage = Math.floor(offset / limit)
      const firstPage = Math.max(currentPage - (Math.ceil(pagesCount / 2) - 1), 0)
      const pages = Array.from({ length: pagesCount }, (v, i) => i + firstPage)

      posts.forEach((post) => {
        post.message = formatMessage(post.message)
        post.timestamp = formatTimestamp(post.timestamp, req.templatingCommon.texts.months)
      })

      res.render('root', {
        boards,
        posts,
        offset,
        limit,
        pages,
        tag: '',
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
