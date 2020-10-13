const httpRequestToBackend = require('./http_request')

function renderError (error) {
  return 'Error ' + error.message
}

const threadHandler = (req, res) => {
  const config = req.app.locals.config
  const options = {
    host: config.backend_hostname,
    port: config.backend_port,
    path: '/post?id=' + req.params.thread_id
  }

  httpRequestToBackend(options)
    .then((backedResponseBody) => {
      const threadData = backedResponseBody.payload.thread_data
      res.render('thread', {
        board_name: req.params.board_name,
        thread: threadData[0],
        posts: threadData.replies
      })
    })
    .catch((error) => {
      res.send(renderError(error))
    })
}

module.exports = threadHandler
