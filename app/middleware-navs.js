const axios = require('axios')

const navsMiddlware = function (req, res, next) {
  const config = req.app.locals.config
  // For now this is large enough offset to get no posts at all
  axios.get(`${config.backend_path}/board/all/?limit=1&offset=88005553535`)
    .then((result) => {
      const allBoards = result.data?.payload?.boards || []
      const navs = allBoards.map(b => `/${b.tag}/`)
      req.allBoards = allBoards
      req.app.locals.navs = navs
      next()
    })
    // We don't care much about boards list, hence this promise may fail
    // silently
    .catch(_ => { next() })
}

module.exports = navsMiddlware
