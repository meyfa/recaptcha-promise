# recaptcha-promise

This Node module aims to provide simple, asynchronous, promise-based ReCAPTCHA
response verification.

This software is in no way affiliated with or endorsed by Google.
Google and the Google Logo are registered trademarks of Google Inc.


## Usage

```
npm install recaptcha-promise
```

```js
const recaptcha = require('recaptcha-promise')

recaptcha.init({
  secret_key: 'YOUR_SECRET_KEY'
})

// with Promises (remoteAddress is optional)
recaptcha(userResponse, remoteAddress).then(function (success) {
  console.log(success ? 'Response valid' : 'Response invalid')
})

// ... or in an async context:
async function handleRequest (userResponse, remoteAddress) {
  const success = await recaptcha(userResponse, remoteAddress)
  console.log(success ? 'Response valid' : 'Response invalid')
}
handleRequest(/* ... */)
```
