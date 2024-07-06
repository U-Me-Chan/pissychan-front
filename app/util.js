function baseURLFromConfig (config) {
  if (config.backend_port) {
    return `${config.backend_proto}://${config.backend_hostname}:${config.backend_port}/`
  }
  return `${config.backend_proto}://${config.backend_hostname}/`
}

function filestoreBaseURLFromConfig (config) {
  if (config.filestore_port) {
    return `${config.filestore_proto}://${config.filestore_hostname}:${config.filestore_port}/`
  }
  return `${config.filestore_proto}://${config.filestore_hostname}/`
}

class HttpError extends Error {
  constructor (status, message) {
    super(message)
    this.status = status
  }
}

module.exports = {
  baseURLFromConfig,
  filestoreBaseURLFromConfig,
  HttpError,
  versionFromConfig (config) {
    const packageName = config.npm_package_name
    const version = config.npm_package_version
    const sha = config.sha_short
    if (!sha) return `${packageName}/${version}`
    const dirty = config.repo_state_dirty || ''
    const branch = config.branch_name
    if (!branch) return `${packageName}/${version}-${sha}${dirty}`
    return `${packageName}/${version}-${sha}${dirty}-${branch}`
  }
}
