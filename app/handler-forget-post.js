const forgetHandler = (req, res) => {
  const strId = String(req.body.id).trim()
  const id = parseInt(strId)
  const nonNumericRegex = /[^0-9]/g
  if (nonNumericRegex.test(strId) || isNaN(id)) {
    // TODO render proper error page
    res.status(400).send('Provided post ID is not a valid number')
    return
  }
  const password = req.postsPasswords.get(id)
  if (password === undefined || password === null) {
    // TODO render proper error page
    res.status(400).send('There is no password available for specified post ID')
    return
  }
  req.postsPasswords.delete(id)
  const yearMs = 1000 * 60 * 60 * 24 * 365
  const expectedEncodedLenMax = 4096 - 'post_passwords'.length
  const postsPaswordsCookie = req.postsPasswords.render(
    expectedEncodedLenMax, encodeURIComponent)
  if (!postsPaswordsCookie.length) {
    res.clearCookie('post_passwords').redirect(`/post/${id}`)
  } else {
    res
      .cookie('post_passwords', postsPaswordsCookie, { maxAge: yearMs })
      .redirect(`/post/${id}`)
  }
}

module.exports = forgetHandler
