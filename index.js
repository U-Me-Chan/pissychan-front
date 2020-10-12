const express = require('express')
const app = express()
const port = 3000

// https://nimblewebdeveloper.com/blog/hot-reload-nodejs-server
// Only run this in development
if (process.env.NODE_ENV !== 'production') {
  const chokidar = require('chokidar')

  // Set up watcher to watch all files in ./app
  const watcher = chokidar.watch('./app')

  watcher.on('ready', function () {
    // On any file change event
    // You could customise this to only run on new/save/delete etc
    // This will also pass the file modified into the callback
    // however for this example we aren't using that information
    watcher.on('all', function () {
      console.log('Reloading server...')
      // Loop through the cached modules
      // The 'id' is the FULL path to the cached module
      Object.keys(require.cache).forEach(function (id) {
        // Get the local path to the module
        const localId = id.substr(process.cwd().length)

        // Ignore anything not in app
        if (!localId.match(/^\/app\//)) return

        // Remove the module from the cache
        delete require.cache[id]
      })
      console.log('Server reloaded.')
    })
  })
}

app.set('view engine', 'pug')

// Hot reload!
// ALL server routes are in this module!
app.use((req, res, next) => {
  require('./app/router')(req, res, next)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
