const passwordsAPI = require('./passwords')
const passwordsMiddlware = (req, res, next) => {
  req.passwords = {
    store: passwordsAPI.parsePasswordsFromString(req.cookies.passwords),
    get: function (id) { return passwordsAPI.get(this.store, id) },
    set: function (id, password) { return passwordsAPI.set(this.store, id, password) },
    render: function () { return passwordsAPI.renderToString(this.store) }
  }
  next()
}

module.exports = passwordsMiddlware
