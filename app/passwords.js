const passwordsAPI = {
  parsePasswordsFromString: (str) => {
    function parsePair (pair) {
      if (!Array.isArray(pair)) return []
      if (pair.length < 2) return []
      const isString = (str) => str instanceof String || typeof str === 'string'
      const idStr = (isString(pair[0])) ? pair[0].trim() : pair[0]
      const id = parseInt(idStr)
      if (isNaN(id)) return []
      const password = String(pair[1])
      return [id, password]
    }
    return new Map(str.split(',').map((i) => parsePair(i.split(':'))))
  },
  get: (store, id) => {
    return store.get(id)
  },
  set: (store, id, password) => {
    return store.set(id, password)
  },
  render: (store) => {
    let str = ''
    for (const [key, value] of store) {
      if (str !== '') {
        str += ','
      }
      str += `${key}:${value}`
    }
    return str
  }
}

module.exports = passwordsAPI
