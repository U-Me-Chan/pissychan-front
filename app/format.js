const linkify = require('linkifyjs/html')

// Must be called after htmlDefuse, so all '>' must be replaced with &gt;
function renderMarkdown (data) {
  const italic = /(?<!\*|\\)\*[^*\n].+?[^*|\\]\*(?!\*)/g // *italic*
  const bold = /(?<!\*|\\\*)\*{2,2}[^*\n].+?[^*]\*{2,2}(?!\*|\\)/g // **bold**
  const monospace = /`[^`]*`/g // `code`
  const reply = /&gt;&gt;\d{1,}/g

  return data.replace(italic, match => '<i>' + match.slice(1, -1) + '</i>')
    .replace(bold, match => '<b>' + match.slice(2, -2) + '</b>')
    .replace(monospace, match => '<code>' + match.slice(1, -1) + '</code>')
    .replace(reply, match => {
      return '<a href=\'#' + match.slice('&gt;&gt;'.length) + '\'>' +
        match + '</a>'
    })
}

function renderNewlines (text) {
  return text.replace(/\n/g, '<br>')
}

module.exports = {
  formatMessage: (text) => {
    if (text === undefined) {
      return ''
    }
    return linkify(renderNewlines(renderMarkdown(text)), {
      className: 'linkified'
    })
  },
  formatTimestamp: (unixtime) => {
    const t = new Date(unixtime * 1000)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
      'Sep', 'Oct', 'Nov', 'Dec']
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
