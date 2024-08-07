function buildThemeUrl (config, theme) {
  return '/' + config.themeDir + (theme || config.defaultTheme) + '.css'
}

const themeMiddlware = (req, res, next) => {
  const themeUrl = buildThemeUrl(req.app.locals.config, req.cookies.theme || undefined)
  req.app.locals.themeUrl = themeUrl
  next()
}

module.exports = themeMiddlware
