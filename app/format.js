const markdown = require('./markdown')
const htmlDefuse = require('./html_defuse')
const linkify = require('linkifyjs/html')
const defaultMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
  'Sep', 'Oct', 'Nov', 'Dec']

// Must be called after htmlDefuse, so all '>' must be replaced with &gt;
function renderReplies (text) {
  const reply = /&gt;&gt;\d{1,}/g
  return text.replace(reply, match => {
    return '<a href=\'#' + match.slice('&gt;&gt;'.length) + '\'>' +
        match + '</a>'
  })
}

function renderMarkdown (text) {
  const italic = /(?<!\*|\\)\*[^*\n].+?[^*|\\]\*(?!\*)/g // *italic*
  const bold = /(?<!\*|\\\*)\*{2,2}[^*\n].+?[^*]\*{2,2}(?!\*|\\)/g // **bold**
  const monospace = /`[^`]*`/g // `code`

  return text.replace(italic, match => '<i>' + match.slice(1, -1) + '</i>')
    .replace(bold, match => '<b>' + match.slice(2, -2) + '</b>')
    .replace(monospace, match => '<code>' + match.slice(1, -1) + '</code>')
}

function renderNewlines (text) {
  return text.replace(/(\r\n)|(\n\r)|\n|\r/g, '<br>')
}

function formatOld (text) {
  const defused = htmlDefuse(text)
  return linkify(renderNewlines(renderReplies(renderMarkdown(defused))), {
    className: 'linkified'
  })
}

function format (text) {
  return renderReplies(markdown(renderNewlines(htmlDefuse(text))))
}

module.exports = {
  formatMessage: (text) => {
    if (text === undefined) {
      return ''
    }
    return format(text)
  },
  formatMessageOld: (text) => {
    if (text === undefined) {
      return ''
    }
    return formatOld(text)
  },
  formatTimestamp: (unixtime, months = defaultMonths) => {
    const t = new Date(unixtime * 1000)
    const year = t.getFullYear()
    const month = months[t.getMonth()]
    const date = t.getDate()
    const hour = '0' + t.getHours()
    const min = '0' + t.getMinutes()
    const sec = '0' + t.getSeconds()
    return date + ' ' + month + ' ' + year + ' ' +
      hour.substr(-2) + ':' + min.substr(-2) + ':' + sec.substr(-2)
  }
}
