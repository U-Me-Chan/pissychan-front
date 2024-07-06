const axios = require('axios')
const { formatMessage, formatTimestamp } = require('./format')

const rootHandler = async (req, res, next) => {
  const config = req.app.locals.config
  const limit = req.query.limit || 20
  const offset = req.query.offset || 0
  const result = await axios.get(
    `${config.backend_path}/board/all/` + '?limit=' + limit + '&offset=' + offset)
  const posts = result.data.payload.posts
  const boards = result.data.payload.boards
  // Since no info about posts count on feed provided by the backend,
  // just assume here that there always is a span of 5 pages.
  const pagesCount = 5
  const currentPage = Math.floor(offset / limit)
  const firstPage = Math.max(currentPage - (Math.ceil(pagesCount / 2) - 1), 0)
  const pages = Array.from({ length: pagesCount }, (v, i) => i + firstPage)

  posts.forEach((post) => {
    post.message = formatMessage(post.message)
    post.timestamp = formatTimestamp(post.timestamp, req.app.locals.texts.months)
    post.password = req.postsPasswords.get(post.id)
  })

  res.render('root', {
    boards,
    posts,
    offset,
    limit,
    pages,
    tag: ''
  })
}

module.exports = rootHandler
