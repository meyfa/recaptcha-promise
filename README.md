# recaptcha-promise

[![CI](https://github.com/meyfa/recaptcha-promise/actions/workflows/main.yml/badge.svg)](https://github.com/meyfa/recaptcha-promise/actions/workflows/main.yml)
[![Test Coverage](https://api.codeclimate.com/v1/badges/daa5cc798bbd3d7f17d0/test_coverage)](https://codeclimate.com/github/meyfa/recaptcha-promise/test_coverage)

This Node module aims to provide simple, asynchronous, promise-based ReCAPTCHA
response verification. TypeScript type definitions are included.

_This software is in no way affiliated with or endorsed by Google._


## Installation

Add to your project's dependencies:

```sh
npm install recaptcha-promise
```


## Usage

### Creating an instance

This is the recommended way. First, an instance is created with your secret key.
It can then be used to verify as many challenges as needed.

```js
const recaptcha = require('recaptcha-promise').create({
  secret: 'YOUR_SECRET_KEY'
})

// In an HTTP handler:

// ... with Promises:
recaptcha.verify(userResponse).then(function (success) {
  console.log(success ? 'Response valid' : 'Response invalid')
})

// ... or in an async context:
async function handleRequest (userResponse) {
  const success = await recaptcha.verify(userResponse)
  console.log(success ? 'Response valid' : 'Response invalid')
}
handleRequest(/* ... */)
```

### The global instance

This exists mostly for legacy reasons. If you do not want to dependency-inject
a custom object, you can configure this package with your secret key globally:

```js
// note the missing .create(...) call
const recaptcha = require('recaptcha-promise')

recaptcha.init({
  secret: 'YOUR_SECRET_KEY' // secret_key and secretKey are also valid
})
```

You can then use `recaptcha` exactly the same as above. You can also require it
elsewhere and it will still have the secret key ready.

### Passing a remote address

If you have the client's remote address available, you can pass it as a second
parameter to the `verify` function.
