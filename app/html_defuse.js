const regex = /[&<>"']/g
const italic = /(?<!\*|\\)\*[^*\n].+?[^*|\\]\*(?!\*)/g // *italic*
const bold = /(?<!\*|\\\*)\*{2,2}[^*\n].+?[^*]\*{2,2}(?!\*|\\)/g // **bold**
const monospace = /`[^`]*`/g // `code`
const reply = />>\d{1,}/g

function parser (data) {
  data = data.replace(italic, function (match) {
    match = match.slice(1, -1)
    return '<i>' + match + '</i>'
  })

  data = data.replace(bold, function (match) {
    match = match.slice(2, -2)
    return '<b>' + match + '</b>'
  })

  data = data.replace(monospace, function (match) {
    match = match.slice(1, -1)
    return '<code>' + match + '</code>'
  })

  data = data.replace(reply, function (match) {
    match = match.slice(2)
    return '<a href=\'#' + match + '\'>&gt;&gt;' + match + '</a>'
  })

  return data
}

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
module.exports = parser
