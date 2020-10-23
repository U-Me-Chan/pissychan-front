const httpRequestToBackend = require('./http_request')
const htmlDefuse = require('./html_defuse')
const parser = require('./html_defuse')
const fmt = require('./format')

function renderError (error) {
  return 'Error ' + error.message
}

const boardHandler = (req, res) => {
  const config = req.app.locals.config
  const options = {
    host: config.backend_hostname,
    port: config.backend_port,
    path: '/board/' + req.params.tag
  }

  httpRequestToBackend(options)
    .then((backedResponseBody) => {
      const boardData = backedResponseBody.payload.board_data
      const threads = boardData.threads
      threads.forEach((post) => {
        post.message = fmt.formatMessage(htmlDefuse(post.message))
        post.message = parser(post.message)
        post.timestamp = fmt.formatTimestamp(post.timestamp)
      })
      res.render('board', {
        tag: boardData.tag,
        board_name: boardData.name,
        threads: threads
      })
    })
    .catch((error) => {
      res.send(renderError(error))
    })
}

module.exports = boardHandler
