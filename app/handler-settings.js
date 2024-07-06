const fs = require('fs')

function themeNamesFromFiles (files) {
  return files
    .filter(v => v.match(/(\.css)$/))
    .map(v => v.replace(/(\.css)$/, ''))
}

const settingsHandler = async (req, res, next) => {
  const config = req.app.locals.config
  // A cookie without expiration date lasts for just a single session
  // which is a very short time on some browsers. For example, on
  // Mozilla Firefox Mobile it gets deleted whenever you close all
  // Pissychan tabs and the browser app itself. The 'theme' cookie have
  // to persist much longer. But some browsers still have y2k38
  // problem, hence you can't set 100 years, because the cookie won't
  // be saved at all. 1 year is kind of a compromise here.
  const yearMs = 1000 * 60 * 60 * 24 * 365

  if (req.query.theme) {
    const files = await fs.promises.readdir(config.publicDir + '/' + config.themeDir)
    const theme = themeNamesFromFiles(files).find(c => c === req.query.theme)
    if (theme && theme !== config.defaultTheme) {
      res.cookie('theme', theme, { maxAge: yearMs }).redirect('/settings')
    } else {
      res.clearCookie('theme').redirect('/settings')
    }
    return
  }

  if (req.query.save_posts_passwords !== undefined) {
    if (req.query.save_posts_passwords === 'true') {
      res.clearCookie('save_posts_passwords')
    } else if (req.query.save_posts_passwords === 'false') {
      res.cookie('save_posts_passwords', 'false', { maxAge: yearMs })
    }
    res.redirect('/settings')
    return
  }

  const result = await fs.promises.readdir(config.publicDir + '/' + config.themeDir)
  const themeNames = themeNamesFromFiles(result)
  const theme = themeNames.find(c => c === req.cookies?.theme) || config.defaultTheme
  const themes = themeNames.map(v => {
    return { name: v, selected: v === theme }
  })

  const postsPasswordsCount = Array.from(req.postsPasswords.store).length
  const oldestPostIdWithPassword = postsPasswordsCount
    ? Array.from(req.postsPasswords.store)
      .map(([key, value]) => key).sort((key1, key2) => key1 - key2)[0]
    : undefined
  res.render('settings', {
    themes,
    postsPasswordsCount,
    savePostsPasswordsEnabled: req.postsPasswords.savingEnabled,
    oldestPostIdWithPassword
  })
}

module.exports = settingsHandler
