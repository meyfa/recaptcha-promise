'use strict'

const axios = require('axios')
const querystring = require('querystring')

/**
 * URL of the verification endpoint
 */
const VERIFY_ENDPOINT = 'https://www.google.com/recaptcha/api/siteverify'

/**
 * The options object, set via .init()
 */
let options = {}

/**
 * Takes a user response and optionally the remote address. Then performs a
 * request to Google for verifying the response using the secret set via .init()
 * and returns the response's validity as a Promise.
 */
async function verify (response, remoteAddress) {
  const postBody = querystring.stringify({
    secret: options.secret_key,
    response: response,
    remoteip: remoteAddress || undefined
  })
  const { data } = await axios.post(VERIFY_ENDPOINT, postBody)
  return data.success
}

module.exports = verify

/**
 * Sets the config object to use for future requests. The object may contain:
 *   - secret_key: the site's secret key to use for validation
 * Returns this module, so that direct chaining with a verify call is possible.
 */
function init (config) {
  if (typeof config !== 'object') {
    throw new Error('config must be an object')
  }
  options = config
  return module.exports
}

module.exports.init = init
