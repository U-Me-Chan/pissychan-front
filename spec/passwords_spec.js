describe('passwordsAPI', function () {
  const passwordsAPI = require('../app/passwords')

  it('should parse proper passwords sets', function () {
    expect(passwordsAPI.parseFromString('33907:asdf')).toEqual(new Map([[33907, 'asdf']]))
    expect(passwordsAPI.parseFromString('33908:qwer')).toEqual(new Map([[33908, 'qwer']]))
    const str = '33905:fba5b7275a3987fa400933c8bfb20c62f0fb13a85ade78cd71a96685445df5d8,' +
      '33906:fba5b7275a3987fa400933c8bfb20c62f0fb13a85ade78cd71a96685445df5d9'
    expect(passwordsAPI.parseFromString(str))
      .toEqual(new Map([
        [33905, 'fba5b7275a3987fa400933c8bfb20c62f0fb13a85ade78cd71a96685445df5d8'],
        [33906, 'fba5b7275a3987fa400933c8bfb20c62f0fb13a85ade78cd71a96685445df5d9']
      ]))
  })

  it('should trim spaces in keys and values', function () {
    expect(passwordsAPI.parseFromString('33909: asdf')).toEqual(new Map([[33909, 'asdf']]))
    expect(passwordsAPI.parseFromString('   33909    : asdf  ')).toEqual(new Map([[33909, 'asdf']]))
  })

  it('should skip enties where post number contains non-digits', function () {
    expect(passwordsAPI.parseFromString('a33910:asdf,33911:pass')).toEqual(new Map([[33911, 'pass']]))
    expect(passwordsAPI.parseFromString('33910a:asdf,33911:pass')).toEqual(new Map([[33911, 'pass']]))
  })

  it('should parse normally with trailing comma', function () {
    expect(passwordsAPI.parseFromString('33912:jkl9,')).toEqual(new Map([[33912, 'jkl9']]))
  })

  it('should skip empty pairs', function () {
    expect(Array.from(passwordsAPI.parseFromString(',')).length).toEqual(0)
    expect(Array.from(passwordsAPI.parseFromString(',,,,,,,')).length).toEqual(0)
    expect(Array.from(passwordsAPI.parseFromString(':,:,:')).length).toEqual(0)
    expect(Array.from(passwordsAPI.parseFromString(':: :, :\n, :  , ')).length).toEqual(0)
  })

  it('should not skip entries where password is empty', function () {
    expect(Array.from(passwordsAPI.parseFromString('33914:,')).length).toEqual(1)
  })

  it('should render proper store', function () {
    expect(passwordsAPI.renderToString(new Map([[33915, 'a1password']]))).toEqual('33915:a1password')
  })

  it('should not perform set if key is not a number', function () {
    const store = passwordsAPI.parseFromString('')
    expect(Array.from(store).length).toEqual(0)
    passwordsAPI.set(store, '33916a', 'password')
    expect(Array.from(store).length).toEqual(0)
    passwordsAPI.set(store, 'a33916', 'password')
    expect(Array.from(store).length).toEqual(0)
  })

  it('should seamlesly work with number passed as string', function () {
    const store = passwordsAPI.parseFromString('')
    expect(passwordsAPI.get(store, '33917')).toEqual(undefined)
    expect(passwordsAPI.get(store, 33917)).toEqual(undefined)
    passwordsAPI.set(store, 33917, 'jklqwer')
    expect(passwordsAPI.get(store, '33917')).toEqual('jklqwer')
    expect(passwordsAPI.get(store, 33917)).toEqual('jklqwer')
    passwordsAPI.delete(store, 33917, 'jklqwer')
    expect(passwordsAPI.get(store, '33917')).toEqual(undefined)
    expect(passwordsAPI.get(store, 33917)).toEqual(undefined)
    passwordsAPI.set(store, '33917', 'jklqwer')
    expect(passwordsAPI.get(store, '33917')).toEqual('jklqwer')
    expect(passwordsAPI.get(store, 33917)).toEqual('jklqwer')
    passwordsAPI.delete(store, '33917', 'jklqwer')
    expect(passwordsAPI.get(store, '33917')).toEqual(undefined)
    expect(passwordsAPI.get(store, 33917)).toEqual(undefined)
  })

  it('should encode multiple passwords successfully', function () {
    const store = passwordsAPI.parseFromString('')
    passwordsAPI.set(store, 33918, 'passwor')
    passwordsAPI.set(store, 33919, 'assword')
    expect(passwordsAPI.renderToString(store, 1000, encodeURIComponent)).toEqual('33918:passwor,33919:assword')
  })

  it('should not render string that exceeds specified size in bytes when urlencoded', function () {
    const store = passwordsAPI.parseFromString('')
    for (let i = 0; i < 100; i++) {
      let suffix = String(i)
      while (suffix.length < 3) suffix = '0' + suffix
      const password = 'fba5b7275a3987fa400933c8bfb20c62f0fb13a85ade78cd71a96685445df' + suffix
      passwordsAPI.set(store, i, password)
    }
    const rendered = encodeURIComponent(
      passwordsAPI.renderToString(
        store,
        4096 - 'post_passwords'.length,
        encodeURIComponent
      ))
    expect(rendered.length).toBeLessThanOrEqual(4096 - 'post_passwords'.length)
  })
})
