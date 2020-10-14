const regex = /\n/g

function formatReadable (text) {
  if (text === undefined) {
    return ''
  }

  return text.replace(regex, function (match) {
    if (match === '\n') {
      return '<br>'
    }
  })
}

module.exports = formatReadable
