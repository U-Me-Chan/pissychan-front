const fs = require('fs')
const u = require('./util')

function themeNamesFromFiles (files) {
  return files
    .filter(v => v.match(/(\.css)$/))
    .map(v => v.replace(/(\.css)$/, ''))
}

const settingsHandler = (req, res) => {
  const config = req.app.locals.config

  if (req.query.theme) {
    fs.promises.readdir(config.publicDir + '/' + config.themeDir)
      .then(files => {
        const theme = themeNamesFromFiles(files).find(c => c === req.query.theme)
        if (theme && theme !== config.defaultTheme) {
          // A cookie without expiration date lasts for just a single session
          // which is a very short time on some browsers. For example, on
          // Mozilla Firefox Mobile it gets deleted whenever you close all
          // Pissychan tabs and the browser app itself. The 'theme' cookie have
          // to persist much longer. But some browsers still have y2k38
          // problem, hence you can't set 100 years, because the cookie won't
          // be saved at all. 1 year is kind of a compromise here.
          const yearMs = 1000 * 60 * 60 * 24 * 365
          res.cookie('theme', theme, { maxAge: yearMs }).redirect('/settings')
        } else {
          res.clearCookie('theme').redirect('/settings')
        }
      }, err => {
        // TODO render proper error page
        res.status(500).send(err)
      })
    return
  }

  fs.promises.readdir(config.publicDir + '/' + config.themeDir)
    .then((result) => {
      const themeNames = themeNamesFromFiles(result)
      const theme = themeNames.find(c => c === req.cookies?.theme) || config.defaultTheme
      const themes = themeNames.map(v => {
        return { name: v, selected: v === theme }
      })

      res.render('settings', {
        themes,
        ...req.templatingCommon,
        version: u.versionFromConfig(config)
      })
    }, (result) => {
      // TODO render proper error page
      res.status(500).send(result)
    })
    .catch(error => {
      console.error(error.stack)
      res.status(500).send(error.stack)
    })
}

module.exports = settingsHandler
