const rootHandler = (req, res) => {
  res.render('root', {
    boards: ['a', 'b', 'pr', 'ra']
  })
}

module.exports = rootHandler
