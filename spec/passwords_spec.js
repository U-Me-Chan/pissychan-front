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
    const store = new Map([[33915, 'a1password']])
    expect(passwordsAPI.renderToString(store)).toEqual('33915:a1password')
    expect(passwordsAPI.renderToString(store, 1000, encodeURIComponent)).toEqual('33915:a1password')
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

  it('should render empty store to empty string', function () {
    const store = passwordsAPI.parseFromString('')
    expect(passwordsAPI.renderToString(store)).toEqual('')
    expect(passwordsAPI.renderToString(store, 1000, encodeURIComponent)).toEqual('')
  })

  it('should render multiple passwords successfully', function () {
    const store = passwordsAPI.parseFromString('')
    passwordsAPI.set(store, 33918, 'passwor')
    passwordsAPI.set(store, 33919, 'assword')
    expect(passwordsAPI.renderToString(store)).toEqual('33918:passwor,33919:assword')
  })

  it('should render multiple passwords successfully when the limit provided', function () {
    const store = passwordsAPI.parseFromString('')
    passwordsAPI.set(store, 33920, 'passwo')
    passwordsAPI.set(store, 33921, 'ssword')
    expect(passwordsAPI.renderToString(store, 1000, encodeURIComponent))
      .toEqual('33920:passwo,33921:ssword')
  })

  it('should crop oldest passwords if rendered string exceeds the limit as if it was urlencoded', function () {
    const store = passwordsAPI.parseFromString('')
    const passBase = 'fba5b7275a3987fa400933c8bfb20c62f0fb13a85ade78cd71a96685445df'
    const postNumberBase = 10000
    for (let i = postNumberBase; i < postNumberBase + 100; i++) {
      let suffix = String(i % 100)
      while (suffix.length < 3) suffix = '0' + suffix
      const password = passBase + suffix
      passwordsAPI.set(store, i, password)
    }
    passwordsAPI.set(store, 20000, 'shouldBePreserved00000000000000000000000000000000000000000000000')
    const expectedEncodedLenMax = 4096 - 'post_passwords'.length
    const rendered = passwordsAPI.renderToString(
      store, expectedEncodedLenMax, encodeURIComponent)
    const encoded = encodeURIComponent(rendered)
    expect(rendered.length).not.toEqual(0)
    expect(encoded.length).toBeLessThanOrEqual(expectedEncodedLenMax)
    const expectedEntriesCount = ((entryStr) => {
      for (let str = entryStr, entries = 0; ; entries++, str += '%2C' + entryStr) {
        if (str.length >= expectedEncodedLenMax) return entries
      }
    })(String(postNumberBase) + '%3A' + passBase + '000')
    const newStore = passwordsAPI.parseFromString(rendered)
    expect(Array.from(newStore).length).toEqual(expectedEntriesCount)
    expect(passwordsAPI.get(newStore, 20000))
      .toEqual('shouldBePreserved00000000000000000000000000000000000000000000000')
  })
})
