const markdown = require('./markdown')
const htmlDefuse = require('./html-defuse')
const defaultMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
  'Sep', 'Oct', 'Nov', 'Dec']

function renderNewlines (text) {
  return text.replace(/(\r\n)|(\n\r)|\n|\r/g, '<br>')
}

module.exports = {
  formatMessage: (text) => renderNewlines(markdown(htmlDefuse(text))),
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
