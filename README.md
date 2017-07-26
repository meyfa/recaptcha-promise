# recaptcha-promise

This Node module aims to provide simple, asynchronous, promise-based ReCAPTCHA
response verification.

This software is in no way affiliated with or endorsed by Google.
Google and the Google Logo are registered trademarks of Google Inc.



## Usage

```
npm install --save recaptcha-promise
```

```javascript
var recaptcha = require("recaptcha-promise");

recaptcha.init({
    secret_key: "YOUR_SECRET_KEY"
});

// remote_address is optional
recaptcha(user_response, remote_address).then(function (success) {
    console.log(success ? "Response valid" : "Response invalid");
});
```



## License

The MIT License (MIT)

Copyright (c) 2016 - 2017 Fabian Meyer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
