const regex = /[&|<|>|"|']/g

function htmlDefuse (data) {
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
