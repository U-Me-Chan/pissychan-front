module.exports = (req, res, next) => {
  req.templatingCommon = { isDeleteConfirmation: true, ...req.templatingCommon }
  require('./handler-thread')(req, res, next)
}
