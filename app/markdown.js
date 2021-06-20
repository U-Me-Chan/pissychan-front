const marked = require('marked')

const tokenizer = {
  strong: _ => {},
  blockquote: _ => {},
  list: _ => {},
  heading: _ => {},
  table: _ => {},
  nptable: _ => {},
  codespan: function (src) {
    const cap = this.rules.inline.code.exec(src)
    if (cap) {
      let text = cap[2].replace(/\n/g, ' ')
      const hasNonSpaceChars = /[^ ]/.test(text)
      const hasSpaceCharsOnBothEnds = /^ /.test(text) && / $/.test(text)
      if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
        text = text.substring(1, text.length - 1)
      }
      return {
        type: 'codespan',
        raw: cap[0],
        text
      }
    }
  },
  inlineText (src, inRawBlock, smartypants) {
    const cap = this.rules.inline.text.exec(src)
    if (cap) {
      const text = cap[0]
      return {
        type: 'text',
        raw: cap[0],
        text
      }
    }
  }
}

const renderer = {
  code: text => '<pre><code>' + text + '</code></pre>',
  codespan: text => '<code>' + text + '</code>',
  paragraph: text => '<p>' + text + '</p>',
  br: _ => '<br>'
}

marked.use({ renderer, tokenizer })

module.exports = marked
