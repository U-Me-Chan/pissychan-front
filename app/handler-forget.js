module.exports = (req, res, next) => {
  req.templatingCommon = { isForgetConfirmation: true, ...req.templatingCommon }
  require('./handler-thread')(req, res, next)
}
