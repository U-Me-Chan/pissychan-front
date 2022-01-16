function baseURLFromConfig (config) {
  return `http://${config.backend_hostname}:${config.backend_port}/`
}

function filestoreURLFromConfig (config) {
  return `http://${config.filestore_hostname}:${config.filestore_post}/`
}

module.exports = {
  baseURLFromConfig,
  filestoreURLFromConfig
}
