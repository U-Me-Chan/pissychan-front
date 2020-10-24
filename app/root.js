const httpRequestToBackend = require('./http_request')
const htmlDefuse = require('./html_defuse')
const fmt = require('./format')

function renderError (error) {
  return 'Error ' + error.message
}

const rootHandler = (req, res) => {
  const config = req.app.locals.config
  const options = {
    host: config.backend_hostname,
    port: config.backend_port,
    path: '/board/all'
  }

  httpRequestToBackend(options)
    .then((resBody) => {
      const posts = resBody.payload.posts
      const boards = resBody.payload.boards

      posts.forEach((post) => {
        post.message = fmt.formatMessage(htmlDefuse(post.message))
        post.timestamp = fmt.formatTimestamp(post.timestamp)
      })

      res.render('root', {
        boards,
        posts
      })
    })
    .catch((error) => {
      res.send(renderError(error))
    })
}

module.exports = rootHandler
