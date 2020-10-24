function baseURLFromConfig (config) {
  return `http://${config.backend_hostname}:${config.backend_port}/`
}

module.exports = {
  baseURLFromConfig
}
