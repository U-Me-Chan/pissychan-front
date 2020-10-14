const linkify = require('linkifyjs/html')

const regex = /\n/g

function renderNewlines (text) {
  return text.replace(regex, function (match) {
    if (match === '\n') {
      return '<br>'
    }
  })
}

module.exports = {
  formatMessage: (text) => {
    if (text === undefined) {
      return ''
    }
    return linkify(renderNewlines(text), { className: 'linkified' })
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
