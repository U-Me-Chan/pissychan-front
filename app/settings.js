const axios = require('axios')
const fs = require('fs')
const u = require('./util')
const i18n = require('./i18n')

function themeNamesFromFiles (files) {
  return files
    .filter(v => v.match(/(\.css)$/))
    .map(v => v.replace(/(\.css)$/, ''))
}

const settingsHandler = (req, res) => {
  const config = req.app.locals.config
  const texts = i18n[config.lang]
  const options = {
    baseURL: u.baseURLFromConfig(config),
    headers: { 'User-Agent': u.versionFromConfig(config) }
  }

  if (req.query.theme) {
    fs.promises.readdir('public/css/theme')
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

  const themeUrl = u.buildThemeUrl(config, req.cookies.theme || undefined)

  Promise.allSettled([
    fs.promises.readdir(config.publicDir + '/' + config.themeDir),
    axios.get('/board/all', options)
  ])
    .then((results) => {
      // We don't care much about boards list, hence this promise may fail
      // silently
      const allBoardsRes = results[1]
      const navs = allBoardsRes.status === 'fulfilled'
        ? allBoardsRes.value.data.payload.boards.map(b => `/${b.tag}/`)
        : []
      const readdirRes = results[0]
      if (readdirRes.status !== 'fulfilled') {
        const errorData = readdirRes.reason
        // TODO render proper error page
        res.status(500).send(errorData)
        return
      }
      const themeNames = themeNamesFromFiles(readdirRes.value)
      const theme = themeNames.find(c => c === req.cookies?.theme) || config.defaultTheme
      const themes = themeNames.map(v => {
        return { name: v, selected: v === theme }
      })

      res.render('settings', {
        navs,
        themeUrl,
        themes,
        texts,
        version: u.versionFromConfig(config)
      })
    })
    .catch(error => {
      console.error(error.stack)
      res.status(500).send(error.stack)
    })
}

module.exports = settingsHandler
