const linkify = require('linkifyjs/html')

const regex = /\n/g

function renderNewlines (text) {
  return text.replace(regex, function (match) {
    if (match === '\n') {
      return '<br>'
    }
  })
}

function formatReadable (text) {
  if (text === undefined) {
    return ''
  }
  return linkify(renderNewlines(text), { className: 'linkified' })
}

module.exports = formatReadable
