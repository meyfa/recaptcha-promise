import recaptcha from '../index.js'
import assert from 'node:assert'
import { getGlobalDispatcher, MockAgent, MockPool, setGlobalDispatcher } from 'undici'

describe('main export', function () {
  const apiPath = '/recaptcha/api/siteverify'
  const matchAny = (): boolean => true

  function createMockPool (): MockPool {
    const mockAgent = new MockAgent()
    mockAgent.disableNetConnect()
    setGlobalDispatcher(mockAgent)

    return mockAgent.get('https://www.google.com')
  }

  const oldGlobalDispatcher = getGlobalDispatcher()
  afterEach(() => setGlobalDispatcher(oldGlobalDispatcher))

  describe('#verify()', function () {
    it('is aliased to the main export', function () {
      assert.strictEqual(recaptcha, recaptcha.verify)
      assert(typeof recaptcha === 'function', 'is not a function')
    })

    it('rejects if unconfigured, does not perform requests', async function () {
      const mockPool = createMockPool()
      let callCount = 0
      mockPool.intercept({ path: matchAny, method: matchAny }).reply(500, () => {
        ++callCount
      })
      // @ts-expect-error - intentionally pass undefined
      recaptcha.init({ secret: undefined }) // reset secret
      await assert.rejects(async () => await recaptcha.verify('foo'))
      assert.strictEqual(callCount, 0)
    })

    it('performs a request with correct body if configured', async function () {
      const mockPool = createMockPool()
      recaptcha.init({ secret: 'test-secret' })
      let callCount = 0
      mockPool.intercept({ path: apiPath, method: 'POST' }).reply(200, (config) => {
        ++callCount
        assert.strictEqual(config.path, '/recaptcha/api/siteverify')
        assert.strictEqual(config.method, 'POST')
        assert.strictEqual(config.body?.toString(), 'secret=test-secret&response=foo&remoteip=bar')
        const contentType = config.headers != null ? new Headers(config.headers).get('Content-Type') : undefined
        assert.strictEqual(contentType, 'application/x-www-form-urlencoded')
        return { success: true }
      })
      await recaptcha.verify('foo', 'bar')
      assert.strictEqual(callCount, 1)
    })

    it('does not pass remoteip if left out', async function () {
      const mockPool = createMockPool()
      recaptcha.init({ secret: 'test-secret' })
      let callCount = 0
      mockPool.intercept({ path: apiPath, method: 'POST' }).reply(200, (config) => {
        ++callCount
        assert.strictEqual(config.body?.toString(), 'secret=test-secret&response=foo&remoteip=')
        return { success: true }
      })
      await recaptcha.verify('foo')
      assert.strictEqual(callCount, 1)
    })

    it('resolves with success value', async function () {
      const mockPool = createMockPool()
      recaptcha.init({ secret: 'test-secret' })
      // case 1
      mockPool.intercept({ path: apiPath, method: 'POST' }).reply(200, (config) => {
        return { success: true }
      })
      assert.strictEqual(await recaptcha.verify('foo'), true)
      // case 2
      mockPool.intercept({ path: apiPath, method: 'POST' }).reply(200, (config) => {
        return { success: false }
      })
      assert.strictEqual(await recaptcha.verify('foo'), false)
    })
  })

  describe('#init()', function () {
    it('throws if passed nothing or not an object', function () {
      // @ts-expect-error - intentionally pass invalid values
      assert.throws(() => recaptcha.init())
      // @ts-expect-error - intentionally pass invalid values
      assert.throws(() => recaptcha.init(null))
      // @ts-expect-error - intentionally pass invalid values
      assert.throws(() => recaptcha.init('foo'))
    })

    it('does not throw if given an object', function () {
      assert.doesNotThrow(() => recaptcha.init({ secret: 'foo' }))
    })

    it('does not distinguish between secret, secretKey, secret_key', async function () {
      const mockPool = createMockPool()
      // case 1
      recaptcha.init({ secret: 'secret' })
      mockPool.intercept({ path: apiPath, method: 'POST' }).reply(200, (config) => {
        assert.strictEqual(config.body?.toString(), 'secret=secret&response=foo&remoteip=bar')
        return { success: true }
      })
      await recaptcha.verify('foo', 'bar')

      // case 2
      recaptcha.init({ secretKey: 'secretKey' } as any)
      mockPool.intercept({ path: apiPath, method: 'POST' }).reply(200, (config) => {
        assert.strictEqual(config.body?.toString(), 'secret=secretKey&response=foo&remoteip=bar')
        return { success: true }
      })
      await recaptcha.verify('foo', 'bar')

      // case 2
      recaptcha.init({ secret_key: 'secret_key' } as any)
      mockPool.intercept({ path: apiPath, method: 'POST' }).reply(200, (config) => {
        assert.strictEqual(config.body?.toString(), 'secret=secret_key&response=foo&remoteip=bar')
        return { success: true }
      })
      await recaptcha.verify('foo', 'bar')
    })
  })

  describe('#create()', function () {
    it('allows creation of unconfigured instances', function () {
      assert.doesNotThrow(() => recaptcha.create())
    })

    it('leaves global instance unchanged', async function () {
      // @ts-expect-error - intentionally pass undefined
      recaptcha.init({ secret: undefined }) // reset secret
      recaptcha.create({ secret: 'test-secret' })
      await assert.rejects(async () => await recaptcha.verify('foo'))
    })

    describe('#verify()', function () {
      it('is aliased to the return value', function () {
        const obj = recaptcha.create()
        assert.strictEqual(obj.verify, obj)
        assert(typeof obj === 'function', 'is not a function')
      })

      it('rejects if unconfigured, does not perform requests', async function () {
        const mockPool = createMockPool()
        let callCount = 0
        mockPool.intercept({ path: matchAny, method: matchAny }).reply(500, () => {
          ++callCount
        })
        const obj = recaptcha.create()
        await assert.rejects(async () => await obj.verify('foo'))
        assert.strictEqual(callCount, 0)
      })

      it('is independent between instances', async function () {
        const mockPool = createMockPool()

        // @ts-expect-error - intentionally pass undefined
        recaptcha.init({ secret: undefined }) // reset secret
        const instance1 = recaptcha.create({ secret: 'secret1' })
        const instance2 = recaptcha.create({ secret: 'secret2' })

        // case 1
        let callCount1 = 0
        mockPool.intercept({ path: apiPath, method: 'POST' }).reply(200, (config) => {
          ++callCount1
          assert.strictEqual(config.body?.toString(), 'secret=secret1&response=foo1&remoteip=bar1')
          return { success: true }
        })
        await instance1.verify('foo1', 'bar1')
        assert.strictEqual(callCount1, 1)

        // case 2
        let callCount2 = 0
        mockPool.intercept({ path: apiPath, method: 'POST' }).reply(200, (config) => {
          ++callCount2
          assert.strictEqual(config.body?.toString(), 'secret=secret2&response=foo2&remoteip=bar2')
          return { success: true }
        })
        await instance2.verify('foo2', 'bar2')
        assert.strictEqual(callCount2, 1)
      })
    })

    describe('#init()', function () {
      it('throws if passed nothing or not an object', function () {
        const obj = recaptcha.create()
        // @ts-expect-error - intentionally pass invalid values
        assert.throws(() => obj.init())
        // @ts-expect-error - intentionally pass invalid values
        assert.throws(() => obj.init(null))
        // @ts-expect-error - intentionally pass invalid values
        assert.throws(() => obj.init('foo'))
      })

      it('does not throw if given an object', function () {
        const obj = recaptcha.create()
        assert.doesNotThrow(() => obj.init({ secret: 'foo' }))
      })

      it('allows re-configuration', async function () {
        const mockPool = createMockPool()
        const obj = recaptcha.create()
        obj.init({ secret: 'test-secret' })
        let callCount = 0
        mockPool.intercept({ path: apiPath, method: 'POST' }).reply(200, (config) => {
          ++callCount
          assert.strictEqual(config.body?.toString(), 'secret=test-secret&response=foo&remoteip=bar')
          return { success: true }
        })
        await obj.verify('foo', 'bar')
        assert.strictEqual(callCount, 1)
      })
    })
  })
})
