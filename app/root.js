const httpRequestToBackend = require('./http_request')

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
    .then((backedResponseBody) => {
      res.render('root', {
        boards: backedResponseBody.payload
      })
    })
    .catch((error) => {
      res.send(renderError(error))
    })
}

module.exports = rootHandler
