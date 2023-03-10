const axios = require('axios')
const u = require('./util')

const deleteHandler = (req, res) => {
  const config = req.app.locals.config
  const options = {
    baseURL: u.baseURLFromConfig(config),
    headers: { 'User-Agent': u.versionFromConfig(config) }
  }
  const id = req.body.id
  const password = req.body.password
  console.log(`handler-delete-post id=${id}, password=${password}`)
  axios.delete(`${config.backend_path}/post/${id}?password=${password}`, options).then(
    _ => res.redirect(`/post/${id}`),
    backRes => res.send(backRes.message)
  ).catch(error => res.send(error.stack))
}

module.exports = deleteHandler
