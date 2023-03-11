function parseNumber (number) {
  const str = String(number).trim()
  const nonNumericRegex = /[^0-9]/g
  if (nonNumericRegex.test(str)) return NaN
  return parseInt(str)
}

const passwordsAPI = {
  parseFromString: (str = '') => {
    function parsePair (pair) {
      if (!Array.isArray(pair)) return []
      if (pair.length < 2) return []
      const id = parseNumber(pair[0])
      if (isNaN(id)) return []
      const password = String(pair[1]).trim()
      return [id, password]
    }
    return new Map(
      str
        .split(',')
        .map(e => parsePair(e.split(':')))
        .filter(e => e.length === 2)
    )
  },
  get: (store, id) => {
    const idNumber = parseNumber(id)
    if (isNaN(idNumber)) return false
    return store.get(idNumber)
  },
  set: (store, id, password) => {
    const idNumber = parseNumber(id)
    if (isNaN(idNumber)) return store
    return store.set(idNumber, password)
  },
  delete: (store, id) => {
    const idNumber = parseNumber(id)
    if (isNaN(idNumber)) return false
    return store.delete(idNumber)
  },
  renderToString: (store, maxSizeWhenUrlencoded) => {
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
