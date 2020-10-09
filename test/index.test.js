/* global describe, it, beforeEach, afterEach */
'use strict'

const assert = require('assert')
const MockAdapter = require('axios-mock-adapter')

const recaptcha = require('../')

describe('main export', function () {
  let mock

  beforeEach(function () {
    mock = new MockAdapter(require('axios'), { onNoMatch: 'throwException' })
  })

  afterEach(function () {
    mock.restore()
    mock = null
  })

  describe('#verify()', function () {
    it('is aliased to the main export', function () {
      assert.strictEqual(recaptcha, recaptcha.verify)
      assert(typeof recaptcha === 'function', 'is not a function')
    })

    it('rejects if unconfigured, does not perform requests', function () {
      recaptcha.init({ secret: undefined }) // reset secret
      return assert.rejects(() => recaptcha.verify('foo')).then(() => {
        assert.strictEqual(mock.history.post.length, 0)
      })
    })

    it('performs a request with correct body if configured', function () {
      recaptcha.init({ secret: 'test-secret' })
      mock.onAny().replyOnce(config => {
        assert.strictEqual(config.url, 'https://www.google.com/recaptcha/api/siteverify')
        assert.strictEqual(config.method, 'post')
        assert.strictEqual(config.data, 'secret=test-secret&response=foo&remoteip=bar')
        assert.strictEqual(config.headers['Content-Type'], 'application/x-www-form-urlencoded')
        return [200, { success: true }]
      })
      return Promise.resolve(recaptcha.verify('foo', 'bar')).then(() => {
        assert.strictEqual(mock.history.post.length, 1)
      })
    })

    it('does not pass remoteip if left out', function () {
      recaptcha.init({ secret: 'test-secret' })
      mock.onAny().replyOnce(config => {
        assert.strictEqual(config.data, 'secret=test-secret&response=foo&remoteip=')
        return [200, { success: true }]
      })
      return Promise.resolve(recaptcha.verify('foo')).then(() => {
        assert.strictEqual(mock.history.post.length, 1)
      })
    })

    it('resolves with success value', function () {
      recaptcha.init({ secret: 'test-secret' })
      return Promise.resolve().then(() => {
        // case 1
        mock.onAny().replyOnce(200, { success: true })
        return recaptcha.verify('foo').then((result) => {
          assert.strictEqual(result, true)
        })
      }).then(() => {
        // case 2
        mock.onAny().replyOnce(200, { success: false })
        return recaptcha.verify('foo').then((result) => {
          assert.strictEqual(result, false)
        })
      })
    })
  })

  describe('#init()', function () {
    it('throws if passed nothing or not an object', function () {
      assert.throws(() => recaptcha.init())
      assert.throws(() => recaptcha.init(null))
      assert.throws(() => recaptcha.init('foo'))
    })

    it('does not throw if given an object', function () {
      assert.doesNotThrow(() => recaptcha.init({ secret: 'foo' }))
    })

    it('does not distinguish between secret, secretKey, secret_key', function () {
      return Promise.resolve().then(() => {
        // case 1
        recaptcha.init({ secret: 'secret' })
        mock.onAny().replyOnce(config => {
          assert.strictEqual(config.data, 'secret=secret&response=foo&remoteip=bar')
          return [200, { success: true }]
        })
        return recaptcha.verify('foo', 'bar')
      }).then(() => {
        // case 2
        recaptcha.init({ secretKey: 'secretKey' })
        mock.onAny().replyOnce(config => {
          assert.strictEqual(config.data, 'secret=secretKey&response=foo&remoteip=bar')
          return [200, { success: true }]
        })
        return recaptcha.verify('foo', 'bar')
      }).then(() => {
        // case 2
        recaptcha.init({ secret_key: 'secret_key' })
        mock.onAny().replyOnce(config => {
          assert.strictEqual(config.data, 'secret=secret_key&response=foo&remoteip=bar')
          return [200, { success: true }]
        })
        return recaptcha.verify('foo', 'bar')
      })
    })
  })

  describe('#create()', function () {
    it('allows creation of unconfigured instances', function () {
      assert.doesNotThrow(() => recaptcha.create())
    })

    it('leaves global instance unchanged', function () {
      recaptcha.init({ secret: undefined }) // reset secret
      recaptcha.create({ secret: 'test-secret' })
      return assert.rejects(() => recaptcha.verify('foo'))
    })

    describe('#verify()', function () {
      it('is aliased to the return value', function () {
        const obj = recaptcha.create()
        assert.strictEqual(obj.verify, obj)
        assert(typeof obj === 'function', 'is not a function')
      })

      it('rejects if unconfigured, does not perform requests', function () {
        const obj = recaptcha.create()
        return assert.rejects(() => obj.verify('foo')).then(() => {
          assert.strictEqual(mock.history.post.length, 0)
        })
      })

      it('is independent between instances', function () {
        recaptcha.init({ secret: undefined }) // reset secret
        const instance1 = recaptcha.create({ secret: 'secret1' })
        const instance2 = recaptcha.create({ secret: 'secret2' })
        return Promise.resolve().then(() => {
          // case 1
          mock.onAny().replyOnce(config => {
            assert.strictEqual(config.data, 'secret=secret1&response=foo1&remoteip=bar1')
            return [200, { success: true }]
          })
          return Promise.resolve(instance1.verify('foo1', 'bar1')).then(() => {
            assert.strictEqual(mock.history.post.length, 1)
          })
        }).then(() => {
          // case 2
          mock.reset()
          mock.onAny().replyOnce(config => {
            assert.strictEqual(config.data, 'secret=secret2&response=foo2&remoteip=bar2')
            return [200, { success: true }]
          })
          return Promise.resolve(instance2.verify('foo2', 'bar2')).then(() => {
            assert.strictEqual(mock.history.post.length, 1)
          })
        })
      })
    })

    describe('#init()', function () {
      it('throws if passed nothing or not an object', function () {
        const obj = recaptcha.create()
        assert.throws(() => obj.init())
        assert.throws(() => obj.init(null))
        assert.throws(() => obj.init('foo'))
      })

      it('does not throw if given an object', function () {
        const obj = recaptcha.create()
        assert.doesNotThrow(() => obj.init({ secret: 'foo' }))
      })

      it('allows re-configuration', function () {
        const obj = recaptcha.create()
        obj.init({ secret: 'test-secret' })
        mock.onAny().replyOnce(config => {
          assert.strictEqual(config.data, 'secret=test-secret&response=foo&remoteip=bar')
          return [200, { success: true }]
        })
        return obj.verify('foo', 'bar')
      })
    })
  })
})
