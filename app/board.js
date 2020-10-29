const axios = require('axios')
const htmlDefuse = require('./html_defuse')
const fmt = require('./format')
const u = require('./util')
const i18n = require('./i18n')

const boardHandler = (req, res) => {
  const config = req.app.locals.config
  const texts = i18n[config.lang]
  const options = {
    baseURL: u.baseURLFromConfig(config),
    headers: { 'User-Agent': config.user_agent }
  }

  Promise.allSettled([
    axios.get('/board/' + req.params.tag, options),
    axios.get('/board/all', options)
  ])
    .then((results) => {
      // We don't care much about boards list, hence this promise may fail
      // silently

      const allBoardsRes = results[1]
      const navs = allBoardsRes.status === 'fulfilled'
        ? allBoardsRes.value.data.payload.boards.map(b => `/${b.tag}/`)
        : []

      // We care about fetching board content, hence fail of this promise is
      // unacceptable

      const boardRes = results[0]
      if (boardRes.status !== 'fulfilled') {
        throw new Error(boardRes.reason)
      }

      const board = boardRes.value.data.payload.board_data
      const threads = board.threads

      threads.forEach((post) => {
        post.message = fmt.formatMessage(htmlDefuse(post.message))
        post.timestamp = fmt.formatTimestamp(post.timestamp, texts.months)
      })

      res.render('board', {
        tag: board.tag,
        board_name: board.name,
        navs,
        threads,
        texts
      })
    })
    .catch(error => res.send(error.stack))
}

module.exports = boardHandler
