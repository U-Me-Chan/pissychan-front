const express = require('express')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')
const axios = require('axios')
const config = require('./config')
const u = require('./app/util')
const app = express()

console.log(config)

axios.defaults.baseURL = u.baseURLFromConfig(config)
axios.defaults.headers.common['User-Agent'] = u.versionFromConfig(config)

app.locals.config = config
app.locals.version = u.versionFromConfig(config)
app.locals.texts = require('./app/middleware-i18n')[config.lang]
app.set('view engine', 'pug')
app.use(express.static(config.publicDir))
app.use(bodyParser.urlencoded({ extended: true })) // For HTML POST forms
app.use(cookieParser())
app.use(fileUpload({
  limits: { fileSize: 50 * 1014 * 1024 },
  useTempFiles: true,
  tempFileDir: config.tmpDir
}))
app.use(require('./app/middleware-navs'))
app.use(require('./app/middleware-theme'))
app.use(require('./app/middleware-passwords'))
// ALL server routes are in this module!
app.use((req, res, next) => {
  require('./app/router')(req, res, next)
})
// Custom error handler for a uniformly looking error page
app.use(require('./app/error'))

app.listen(config.port, () => {
  console.log(`Example app listening at http://localhost:${config.port}`)
})
