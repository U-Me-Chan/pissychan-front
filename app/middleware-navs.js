const axios = require('axios')

const navsMiddlware = function (req, res, next) {
  const config = req.app.locals.config
  // For now this is large enough offset to get no posts at all
  let path = `${config.backend_path}/board/all/?limit=1&offset=88005553535`
  if (config.apiv2 === true) {
    path = `${config.backend_path}/v2/board`
  }
  axios.get(path)
    .then((result) => {
      req.allBoards = result.data?.payload?.boards || []
      req.app.locals.navs = req.allBoards.map(b => `/${b.tag}/`)
      next()
    })
    // We don't care much about boards list, hence this promise may fail
    // silently
    .catch(_ => { next() })
}

module.exports = navsMiddlware
