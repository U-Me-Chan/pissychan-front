const markdown = require('./markdown')
const htmlDefuse = require('./html-defuse')
const defaultMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
  'Sep', 'Oct', 'Nov', 'Dec']

function renderNewlines (text) {
  return text.replace(/(\r\n)|(\n\r)|\n|\r/g, '<br>')
}

function replyRenderingContext (neighbors, extPostLinkSuffix) {
  return function (token) {
    const replyNumber = parseInt(token.text)
    if (Array.isArray(neighbors) && neighbors.includes(replyNumber)) {
      return `<a class="markdown-reply" href='#${replyNumber}'>${token.raw}</a>`
    }
    const link = `/post/${replyNumber}`
    const text = `&gt;&gt;${replyNumber}${extPostLinkSuffix || ''}`
    return `<a class="markdown-reply" href='${link}'>${text}</a>`
  }
}

module.exports = {
  formatMessage: function (text, neighbors, extPostLinkSuffix) {
    // neighbors - list of all posts on the same page that do not require external linking
    const markdownLoaded = markdown(replyRenderingContext(neighbors, extPostLinkSuffix))
    return renderNewlines(markdownLoaded(htmlDefuse(text)))
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
