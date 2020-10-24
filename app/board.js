const axios = require('axios')
const htmlDefuse = require('./html_defuse')
const fmt = require('./format')
const u = require('./util')

const boardHandler = (req, res) => {
  const config = req.app.locals.config
  const options = {
    baseURL: u.baseURLFromConfig(config),
    headers: { 'User-Agent': config.user_agent }
  }

  axios.get('/board/' + req.params.tag, options)
    .then((backRes) => {
      const board = backRes.data.payload.board_data
      const threads = board.threads

      threads.forEach((post) => {
        post.message = fmt.formatMessage(htmlDefuse(post.message))
        post.timestamp = fmt.formatTimestamp(post.timestamp)
      })

      res.render('board', {
        tag: board.tag,
        board_name: board.name,
        threads
      })
    }, backRes => res.send(backRes.message))
    .catch(error => res.send(error.stack))
}

module.exports = boardHandler
