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
  renderToString: (store, maxSizeWhenEncoded, encode = a => a) => {
    const pairs = Array.from(store).map(([key, value]) => `${key}:${value}`)
      .sort(([key1, value1], [key2, value2]) => key1 - key2)
    if (maxSizeWhenEncoded === undefined || maxSizeWhenEncoded === null) {
      return pairs.join(',')
    }
    // Using binary search can possibly bring a decent optimization that fits
    // any encoding here
    for (let i = 1; i <= pairs.length; i++) {
      const str = pairs.slice(pairs.length - i, pairs.length).join(',')
      if (encode(str).length > maxSizeWhenEncoded) {
        return pairs.slice(pairs.length - (i - 1), pairs.length).join(',')
      }
    }
    return pairs.join(',')
  }
}

module.exports = passwordsAPI
