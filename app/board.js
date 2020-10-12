const http = require('http')

function renderError (error) {
  return 'Error ' + error.message
}

// https://stackoverflow.com/questions/38533580/nodejs-how-to-promisify-http-request-reject-got-called-two-times
function httpRequestToBackend (params, postData) {
  return new Promise(function (resolve, reject) {
    var req = http.request(params, function (res) {
      // reject on bad status
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error('statusCode=' + res.statusCode))
      }
      // cumulate data
      var body = []
      res.on('data', function (chunk) {
        body.push(chunk)
      })
      // resolve on end
      res.on('end', function () {
        try {
          body = JSON.parse(Buffer.concat(body).toString())
        } catch (e) {
          reject(e)
        }
        resolve(body)
      })
    })
    // reject on request error
    req.on('error', function (err) {
      // This is not a "Second reject", just a different sort of failure
      reject(err)
    })
    if (postData) {
      req.write(postData)
    }
    // IMPORTANT
    req.end()
  })
}

const boardHandler = (req, res) => {
  const options = {
    // FIXME: Move host to config file
    host: 'pissykaka.ritsuka.host',
    path: '/board?name=' + req.params.board_name
  }

  httpRequestToBackend(options)
    .then((backedResponseBody) => {
      const boardData = backedResponseBody.payload.board_data
      res.render('board', {
        board_name: boardData.name,
        threads: boardData.threads
      })
    })
    .catch((error) => {
      res.send(renderError(error))
    })
}

module.exports = boardHandler
