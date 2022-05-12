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
          res.cookie('theme', theme).redirect('/settings')
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
