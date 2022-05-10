const axios = require('axios')
const { formatMessage, formatTimestamp } = require('./format')
const u = require('./util')
const i18n = require('./i18n')

const boardHandler = (req, res) => {
  const config = req.app.locals.config
  const texts = i18n[config.lang]
  const options = {
    baseURL: u.baseURLFromConfig(config),
    headers: { 'User-Agent': u.versionFromConfig(config) }
  }

  const limit = req.query.limit || 20
  const offset = req.query.offset || 0

  Promise.allSettled([
    axios.get('/board/' + req.params.tag + '/?limit=' + limit + '&offset=' + offset, options),
    axios.get('/board/all', options)
  ])
    .then((results) => {
      // We don't care much about boards list, hence this promise may fail
      // silently

      const allBoardsRes = results[1]
      const navs = allBoardsRes.status === 'fulfilled'
        ? allBoardsRes.value.data.payload.boards.map(b => `/${b.tag}/`)
        : []
      const themeUrl = u.buildThemeUrl(config, req.cookies.theme || undefined)

      // We care about fetching board content, hence fail of this promise is
      // unacceptable
      const boardRes = results[0]
      if (boardRes.status !== 'fulfilled') {
        const errorData = boardRes.reason.response?.data?.error?.message ||
          JSON.stringify(boardRes.reason.response?.data)
        res.status(boardRes.reason.response?.status || 500)
          .render('board_error', {
            tag: req.params.tag,
            themeUrl,
            navs,
            errorCode: boardRes.reason.response?.status || boardRes.reason.code,
            errorData,
            texts,
            version: u.versionFromConfig(config)
          })
        return
      }

      const board = boardRes.value.data.payload.board_data
      const threads = board.threads
      const count = board.threads_count
      const pages = Array.from({ length: Math.ceil(count / limit) }, (v, i) => i)

      threads.forEach((post) => {
        post.message = formatMessage(post.message)
        post.timestamp = formatTimestamp(post.timestamp, texts.months)
        post.repliesCount = post.replies_count
      })

      res.render('board', {
        tag: board.tag,
        boardName: board.name,
        navs,
        themeUrl,
        threads,
        texts,
        offset,
        limit,
        pages,
        version: u.versionFromConfig(config)
      })
    })
    .catch(error => {
      console.error(error.stack)
      res.status(500).send(error.stack)
    })
}

module.exports = boardHandler
