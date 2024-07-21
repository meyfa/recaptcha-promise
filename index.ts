/**
 * URL of the verification endpoint.
 */
const VERIFY_ENDPOINT = 'https://www.google.com/recaptcha/api/siteverify'

/**
 * The settings that can be passed to configure recaptcha verifiers.
 * This includes the secret key, which is mandatory.
 */
export interface RecaptchaVerifierConfig {
  secret: string
}

/**
 * An object that can be used to verify recaptcha responses (verify method).
 * It can be re-configured at a later time by calling init with a new config.
 * Additional instances can be obtained by calling the create method.
 */
export interface RecaptchaVerifier {
  /**
   * Verify a challenge-response.
   *
   * @param response The user's response to the challenge.
   * @param remoteAddress The user's remote address (if available).
   * @returns A Promise resolving to whether the response is correct.
   */
  (response: any, remoteAddress?: string | undefined | null): Promise<boolean>

  /**
   * Verify a challenge-response.
   *
   * @param response The user's response to the challenge.
   * @param remoteAddress The user's remote address (if available).
   * @returns A Promise resolving to whether the response is correct.
   */
  verify: (response: any, remoteAddress?: string | undefined | null) => Promise<boolean>

  /**
   * Configure (or re-configure) this instance.
   *
   * @param config The new configuration.
   * @returns This instance, for call chaining.
   */
  init: (config: RecaptchaVerifierConfig) => this

  /**
   * Create an additional verifier instance.
   * Note that there is no config inheritance of any kind, so calling this
   * method without a config will result in an unconfigured verifier.
   *
   * @returns The created verifier.
   */
  create: (config?: RecaptchaVerifierConfig) => RecaptchaVerifier
}

function getSecret (config: RecaptchaVerifierConfig | { secretKey: string } | { secret_key: string }): string | undefined {
  return 'secret' in config
    ? config.secret
    : 'secretKey' in config
      ? config.secretKey
      : config.secret_key
}

/**
 * Create a new verifier instance. The returned object exposes a `verify` method
 * and an `init` method for (re-)configuration. Moreover, the returned object
 * can be called as a function directly, which is synonymous to calling
 * `verify`.
 *
 * @param config The initial config object.
 * @returns The created verifier instance.
 */
function createInstance (config?: RecaptchaVerifierConfig): RecaptchaVerifier {
  let secret: string | undefined

  // this is returned directly, to allow function invocation
  const verify = async (response: any, remoteAddress?: string | undefined | null): Promise<boolean> => {
    if (secret == null) {
      throw new Error('secret not configured')
    }
    const postBody = new URLSearchParams({
      secret,
      response,
      remoteip: remoteAddress ?? ''
    }).toString()
    const postResponse = await fetch(VERIFY_ENDPOINT, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: postBody
    })
    const data = await postResponse.json()
    if (data == null || typeof data !== 'object' || !('success' in data) || typeof data.success !== 'boolean') {
      throw new Error('unexpected response')
    }
    return data.success
  }

  // this is added as a property to allow newer syntax
  verify.verify = verify

  // this is added to support (re-)configuration
  verify.init = (config: RecaptchaVerifierConfig) => {
    if (typeof config !== 'object' || config == null) {
      throw new Error('config object not provided')
    }
    secret = getSecret(config)
    return verify
  }

  // load initial config if provided
  if (config != null) {
    verify.init(config)
  }

  verify.create = createInstance

  return verify
}

const main = createInstance()
export default main
