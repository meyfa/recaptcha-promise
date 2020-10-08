'use strict'

const Promise = require('bluebird')
const request = require('request')

/**
 * URL of the verification endpoint
 */
const url = 'https://www.google.com/recaptcha/api/siteverify'

/**
 * The options object, set via .init()
 */
let options = {}

/**
 * Takes a user response and optionally the remote address. Then performs a
 * request to Google for verifying the response using the secret set via .init()
 * and returns the response's validity as a Promise.
 */
module.exports = function verify (response, remoteAddress) {
  return new Promise(function (resolve, reject) {
    const params = {
      form: {
        secret: options.secret_key,
        response: response
      }
    }
    if (remoteAddress) {
      params.form.remoteip = remoteAddress
    }

    request.post(url, params, function (err, res, body) {
      if (err) {
        // some request error occurred
        return reject(err)
      } else if (res.statusCode !== 200) {
        // error reported by ReCAPTCHA endpoint
        return reject(new Error('recaptcha status ' + res.statusCode))
      }
      resolve(JSON.parse(body).success)
    })
  })
}

/**
 * Sets the config object to use for future requests. The object may contain:
 *   - secret_key: the site's secret key to use for validation
 * Returns this module, so that direct chaining with a verify call is possible.
 */
module.exports.init = function (config) {
  if (typeof config !== 'object') {
    throw new Error('config must be an object')
  }
  options = config
  return module.exports
}
