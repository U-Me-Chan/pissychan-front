function htmlDefuse (data) {
  const regex = /[&<>"']/g
  return data.replace(regex, function (match) {
    if (match === '&') {
      return '&amp;'
    } else if (match === '<') {
      return '&lt;'
    } else if (match === '>') {
      return '&gt;'
    } else if (match === '"') {
      return '&quot;'
    } else {
      return '&apos;'
    }
  })
}

module.exports = htmlDefuse
