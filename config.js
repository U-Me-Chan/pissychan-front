const dev = {
  env_name: 'dev',
  port: 3000,
  backend_hostname: 'pissykaka.ritsuka.host',
  backend_port: 80
}

const production = {
  env_name: 'production',
  port: 8080,
  backend_hostname: 'pissykaka.ritsuka.host',
  backend_port: 80
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
  if (isEnvVarDefined('BACKEND_HOSTNAME')) {
    config.backend_hostname = process.env.BACKEND_HOSTNAME
  }
  if (isEnvVarDefined('BACKEND_PORT')) {
    config.backend_port = parseInt(process.env.BACKEND_PORT)
  }
  return config
}

module.exports = overrideFromEnvVars(envConfig[getEnvName()])
