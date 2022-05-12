const axios = require('axios')
const u = require('./util')

const navsMiddlware = function (req, res, next) {
  const config = req.app.locals.config
  const options = {
    baseURL: u.baseURLFromConfig(config),
    headers: { 'User-Agent': u.versionFromConfig(config) }
  }

  Promise.allSettled([
    axios.get('/board/all', options)
  ])
    .then((results) => {
      // We don't care much about boards list, hence this promise may fail
      // silently
      const allBoardsRes = results[0]
      const allBoards = allBoardsRes.status === 'fulfilled'
        ? allBoardsRes.value.data.payload.boards
        : []
      const navs = allBoards.map(b => `/${b.tag}/`)
      req.allBoards = allBoards
      req.templatingCommon = { navs, ...req.templatingCommon }
      next()
    })
    .catch(error => {
      console.error(error.stack)
      res.status(500).send(error.stack)
    })
}

module.exports = navsMiddlware
