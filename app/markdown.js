const marked = require('marked')

const tokenizer = {
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

const reply = {
  name: 'reply',
  level: 'inline',
  start (src) { return src.match(/&gt;/)?.index },
  tokenizer (src, tokens) {
    const cap = /&gt;&gt;(\d{1,})/.exec(src)
    if (cap?.index === 0) {
      return {
        type: 'reply',
        raw: cap[0],
        tokens: [],
        text: cap[1]
      }
    }
  },
  renderer (token) {
    return `<a class="markdown-reply" href='#${token.text}'>${token.raw}</a>`
  }
}

marked.use({ renderer, tokenizer })
marked.use({ extensions: [reply] })

module.exports = marked.parse
