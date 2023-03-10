describe('passwordsAPI', function () {
  const passwordsAPI = require('../app/passwords')

  it('should parse valid passwords set', function () {
    expect(passwordsAPI.parsePasswordsFromString('33907:asdf')).toEqual(new Map([[33907, 'asdf']]))
    expect(passwordsAPI.parsePasswordsFromString('33908:qwer')).toEqual(new Map([[33908, 'qwer']]))
  })
})
