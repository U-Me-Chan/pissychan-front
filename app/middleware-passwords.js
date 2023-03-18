const passwordsAPI = require('./passwords')
const passwordsMiddlware = (req, res, next) => {
  req.postsPasswords = {
    store: passwordsAPI.parseFromString(req.cookies.post_passwords),
    get: function (id) { return passwordsAPI.get(this.store, id) },
    set: function (id, password) { return passwordsAPI.set(this.store, id, password) },
    delete: function (id) { return passwordsAPI.delete(this.store, id) },
    render: function (maxSizeWhenEncoded, encode = a => a) {
      return passwordsAPI.renderToString(this.store, maxSizeWhenEncoded, encode)
    }
  }
  next()
}

module.exports = passwordsMiddlware
