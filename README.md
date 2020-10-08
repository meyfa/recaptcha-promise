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

// remote_address is optional
recaptcha(user_response, remote_address).then(function (success) {
  console.log(success ? 'Response valid' : 'Response invalid')
})
```
