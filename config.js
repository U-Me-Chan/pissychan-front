const { execSync } = require('child_process')
const { readFileSync } = require('fs')

const dev = {
  env_name: 'dev',
  port: 3000,
  backend_proto: 'https',
  backend_hostname: 'scheoble.xyz',
  backend_port: undefined,
  backend_path: '/api',
  lang: 'en',
  filestore_proto: 'https',
  filestore_hostname: 'scheoble.xyz',
  filestore_port: undefined,
  filestore_path: '/filestore',
  themeDir: 'css/theme/',
  publicDir: 'public',
  defaultTheme: 'pissychan'
}

const production = {
  env_name: 'production',
  port: 8080,
  backend_proto: 'https',
  backend_hostname: 'scheoble.xyz',
  backend_port: undefined,
  backend_path: '/api',
  lang: 'ru',
  filestore_proto: 'https',
  filestore_hostname: 'scheoble.xyz',
  filestore_port: undefined,
  filestore_path: '/filestore',
  themeDir: 'css/theme/',
  publicDir: 'public',
  defaultTheme: 'pissychan'
}

const envConfig = {
  dev,
  production
}

function isEnvVarDefined (name) {
  return !(process.env[name] === undefined || process.env[name] === '')
}

function getEnvName () {
  if (isEnvVarDefined('NODE_ENV')) {
    return process.env.NODE_ENV
  } else {
    return 'dev'
  }
}

function overrideFromEnvVars (config) {
  if (isEnvVarDefined('PORT')) {
    config.port = parseInt(process.env.PORT)
  }
  if (isEnvVarDefined('UI_LANG')) {
    config.lang = process.env.UI_LANG.substr(0, 2)
  }
  if (isEnvVarDefined('BACKEND_HOSTNAME')) {
    config.backend_hostname = process.env.BACKEND_HOSTNAME
  }
  if (isEnvVarDefined('BACKEND_PORT')) {
    config.backend_port = parseInt(process.env.BACKEND_PORT)
  }
  if (isEnvVarDefined('FILESTORE_HOSTNAME')) {
    config.filestore_hostname = process.env.FILESTORE_HOSTNAME
  }
  if (isEnvVarDefined('FILESTORE_PORT')) {
    config.filestore_port = parseInt(process.env.FILESTORE_PORT)
  }
  return config
}

function extractGitBranchName () {
  try {
    return execSync('git branch --show-current', {
      stdio: ['ignore', 'pipe', 'ignore']
    }).toString('utf8').replace(/^\s+|\s+$/g, '')
  } catch {}
}

function extractGitShaShort () {
  try {
    return execSync('git rev-parse --short HEAD', {
      stdio: ['ignore', 'pipe', 'ignore']
    }).toString('utf8').replace(/^\s+|\s+$/g, '')
  } catch {}
}

function extractRepoStateDirty () {
  try {
    return execSync('git diff', {
      stdio: ['ignore', 'pipe', 'ignore']
    }).toString('utf8').replace(/^\s+|\s+$/g, '').length > 0
      ? '+'
      : ''
  } catch {}
}

function extractPackageName () {
  try {
    return JSON.parse(readFileSync('package.json', 'utf8')).name
  } catch {
    return 'pissychan'
  }
}

function extractPackageVersion () {
  try {
    return JSON.parse(readFileSync('package.json', 'utf8')).version
  } catch {
    return '9999.0.0'
  }
}

const envVars = {
  branch_name: process.env.branch_name || extractGitBranchName(),
  bundle_name: process.env.bundle_name,
  npm_package_name: process.env.npm_package_name || extractPackageName(),
  npm_package_version: process.env.npm_package_version || extractPackageVersion(),
  sha_short: process.env.sha_short || extractGitShaShort(),
  repo_state_dirty: process.env.repo_state_dirty || extractRepoStateDirty()
}

module.exports = { ...overrideFromEnvVars(envConfig[getEnvName()]), ...envVars }
