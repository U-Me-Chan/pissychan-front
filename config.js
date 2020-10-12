function getEnv () {
  if (process.env.NODE_ENV === undefined || process.env.NODE_ENV === '') {
    return 'dev'
  } else {
    return process.env.NODE_ENV
  }
}

const env = getEnv()

console.log('Environment: ' + env)

const dev = {
  backend_hostname: 'pissykaka.ritsuka.host',
  backend_port: 80
}

const production = dev

const config = {
  dev,
  production
}

module.exports = config[env]
