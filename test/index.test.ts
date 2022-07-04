import { after } from 'mocha'
import assert from 'assert'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

// eslint-disable-next-line import/extensions
import recaptcha from '../index'

describe('main export', function () {
  const mock = new MockAdapter(axios, { onNoMatch: 'throwException' })

  afterEach(function () {
    mock.reset()
  })

  after(function () {
    mock.restore()
  })

  describe('#verify()', function () {
    it('is aliased to the main export', function () {
      assert.strictEqual(recaptcha, recaptcha.verify)
      assert(typeof recaptcha === 'function', 'is not a function')
    })

    it('rejects if unconfigured, does not perform requests', async function () {
      // @ts-expect-error
      recaptcha.init({ secret: undefined }) // reset secret
      await assert.rejects(async () => await recaptcha.verify('foo'))
      assert.strictEqual(mock.history.post.length, 0)
    })

    it('performs a request with correct body if configured', async function () {
      recaptcha.init({ secret: 'test-secret' })
      mock.onAny().replyOnce(config => {
        assert.strictEqual(config.url, 'https://www.google.com/recaptcha/api/siteverify')
        assert.strictEqual(config.method, 'post')
        assert.strictEqual(config.data, 'secret=test-secret&response=foo&remoteip=bar')
        const contentType = config.headers != null ? config.headers['Content-Type'] : undefined
        assert.strictEqual(contentType, 'application/x-www-form-urlencoded')
        return [200, { success: true }]
      })
      await recaptcha.verify('foo', 'bar')
      assert.strictEqual(mock.history.post.length, 1)
    })

    it('does not pass remoteip if left out', async function () {
      recaptcha.init({ secret: 'test-secret' })
      mock.onAny().replyOnce(config => {
        assert.strictEqual(config.data, 'secret=test-secret&response=foo&remoteip=')
        return [200, { success: true }]
      })
      await recaptcha.verify('foo')
      assert.strictEqual(mock.history.post.length, 1)
    })

    it('resolves with success value', async function () {
      recaptcha.init({ secret: 'test-secret' })
      // case 1
      mock.onAny().replyOnce(200, { success: true })
      assert.strictEqual(await recaptcha.verify('foo'), true)
      // case 2
      mock.onAny().replyOnce(200, { success: false })
      assert.strictEqual(await recaptcha.verify('foo'), false)
    })
  })

  describe('#init()', function () {
    it('throws if passed nothing or not an object', function () {
      // @ts-expect-error
      assert.throws(() => recaptcha.init())
      // @ts-expect-error
      assert.throws(() => recaptcha.init(null))
      // @ts-expect-error
      assert.throws(() => recaptcha.init('foo'))
    })

    it('does not throw if given an object', function () {
      assert.doesNotThrow(() => recaptcha.init({ secret: 'foo' }))
    })

    it('does not distinguish between secret, secretKey, secret_key', async function () {
      // case 1
      recaptcha.init({ secret: 'secret' })
      mock.onAny().replyOnce(config => {
        assert.strictEqual(config.data, 'secret=secret&response=foo&remoteip=bar')
        return [200, { success: true }]
      })
      await recaptcha.verify('foo', 'bar')

      // case 2
      recaptcha.init({ secretKey: 'secretKey' } as any)
      mock.onAny().replyOnce(config => {
        assert.strictEqual(config.data, 'secret=secretKey&response=foo&remoteip=bar')
        return [200, { success: true }]
      })
      await recaptcha.verify('foo', 'bar')

      // case 2
      recaptcha.init({ secret_key: 'secret_key' } as any)
      mock.onAny().replyOnce(config => {
        assert.strictEqual(config.data, 'secret=secret_key&response=foo&remoteip=bar')
        return [200, { success: true }]
      })
      await recaptcha.verify('foo', 'bar')
    })
  })

  describe('#create()', function () {
    it('allows creation of unconfigured instances', function () {
      assert.doesNotThrow(() => recaptcha.create())
    })

    it('leaves global instance unchanged', async function () {
      // @ts-expect-error
      recaptcha.init({ secret: undefined }) // reset secret
      recaptcha.create({ secret: 'test-secret' })
      return await assert.rejects(async () => await recaptcha.verify('foo'))
    })

    describe('#verify()', function () {
      it('is aliased to the return value', function () {
        const obj = recaptcha.create()
        assert.strictEqual(obj.verify, obj)
        assert(typeof obj === 'function', 'is not a function')
      })

      it('rejects if unconfigured, does not perform requests', async function () {
        const obj = recaptcha.create()
        await assert.rejects(async () => await obj.verify('foo'))
        assert.strictEqual(mock.history.post.length, 0)
      })

      it('is independent between instances', async function () {
        // @ts-expect-error
        recaptcha.init({ secret: undefined }) // reset secret
        const instance1 = recaptcha.create({ secret: 'secret1' })
        const instance2 = recaptcha.create({ secret: 'secret2' })

        // case 1
        mock.onAny().replyOnce(config => {
          assert.strictEqual(config.data, 'secret=secret1&response=foo1&remoteip=bar1')
          return [200, { success: true }]
        })
        await instance1.verify('foo1', 'bar1')
        assert.strictEqual(mock.history.post.length, 1)

        // case 2
        mock.reset()
        mock.onAny().replyOnce(config => {
          assert.strictEqual(config.data, 'secret=secret2&response=foo2&remoteip=bar2')
          return [200, { success: true }]
        })
        await instance2.verify('foo2', 'bar2')
        assert.strictEqual(mock.history.post.length, 1)
      })
    })

    describe('#init()', function () {
      it('throws if passed nothing or not an object', function () {
        const obj = recaptcha.create()
        // @ts-expect-error
        assert.throws(() => obj.init())
        // @ts-expect-error
        assert.throws(() => obj.init(null))
        // @ts-expect-error
        assert.throws(() => obj.init('foo'))
      })

      it('does not throw if given an object', function () {
        const obj = recaptcha.create()
        assert.doesNotThrow(() => obj.init({ secret: 'foo' }))
      })

      it('allows re-configuration', async function () {
        const obj = recaptcha.create()
        obj.init({ secret: 'test-secret' })
        mock.onAny().replyOnce(config => {
          assert.strictEqual(config.data, 'secret=test-secret&response=foo&remoteip=bar')
          return [200, { success: true }]
        })
        await obj.verify('foo', 'bar')
      })
    })
  })
})
