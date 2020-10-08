'use strict'

const axios = require('axios')
const querystring = require('querystring')

// CONSTANTS

/**
 * URL of the verification endpoint.
 *
 * @type {string}
 */
const VERIFY_ENDPOINT = 'https://www.google.com/recaptcha/api/siteverify'

/**
 * Create a new verifier instance. The returned object exposes a `verify` method
 * and an `init` method for (re-)configuration. Moreover, the returned object
 * can be called as a function directly, which is synonymous to calling
 * `verify`.
 *
 * @param {?object} config The initial config object.
 * @returns {Function} The created verifier instance.
 */
function createInstance (config) {
  let secret = null

  // this is returned directly, to allow function invocation
  const verify = async (response, remoteAddress) => {
    if (!secret) {
      throw new Error('secret not configured')
    }
    const postBody = querystring.stringify({
      secret: secret,
      response: response,
      remoteip: remoteAddress || undefined
    })
    const { data } = await axios.post(VERIFY_ENDPOINT, postBody)
    return data.success
  }

  // this is added as a property to allow newer syntax
  verify.verify = verify

  // this is added to support (re-)configuration
  verify.init = (config) => {
    if (typeof config !== 'object' || !config) {
      throw new Error('config object not provided')
    }
    secret = config.secret || config.secretKey || config.secret_key
    return verify
  }

  // load initial config if provided
  if (config) {
    verify.init(config)
  }

  return verify
}

const globalInstance = createInstance()
// the global instance should also have a `create` method for customization
globalInstance.create = createInstance
module.exports = globalInstance
