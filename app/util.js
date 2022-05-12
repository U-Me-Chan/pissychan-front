function baseURLFromConfig (config) {
  return `http://${config.backend_hostname}:${config.backend_port}/`
}

function filestoreURLFromConfig (config) {
  return `http://${config.filestore_hostname}:${config.filestore_port}/`
}

module.exports = {
  baseURLFromConfig,
  filestoreURLFromConfig,
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
