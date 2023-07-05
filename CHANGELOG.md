# Changelog

## [3.0.0](https://github.com/meyfa/recaptcha-promise/compare/v2.0.2...v3.0.0) (2023-07-05)


### ⚠ BREAKING CHANGES

* Drop support for Node.js older than v18.16.1 ([#112](https://github.com/meyfa/recaptcha-promise/issues/112))

### Miscellaneous Chores

* Drop support for Node.js older than v18.16.1 ([#112](https://github.com/meyfa/recaptcha-promise/issues/112)) ([153a3ce](https://github.com/meyfa/recaptcha-promise/commit/153a3cedd285e7072b3e0bd8d9da08a0d0b1c262))

## [2.0.2](https://github.com/meyfa/recaptcha-promise/compare/v2.0.1...v2.0.2) (2022-10-08)


### Bug Fixes

* **deps:** update dependency axios to ^1.1.2 ([#79](https://github.com/meyfa/recaptcha-promise/issues/79)) ([6e70601](https://github.com/meyfa/recaptcha-promise/commit/6e7060109729554ba08b2e5d4ecc25a8c78d56cd))
* Use URLSearchParams instead of querystring ([#77](https://github.com/meyfa/recaptcha-promise/issues/77)) ([99200cf](https://github.com/meyfa/recaptcha-promise/commit/99200cf8f882299865cc6b313c70f0a49909a77a))

## [2.0.1](https://github.com/meyfa/recaptcha-promise/compare/v2.0.0...v2.0.1) (2022-10-06)


### Bug Fixes

* **deps:** update dependency axios to ^0.25.0 ([#22](https://github.com/meyfa/recaptcha-promise/issues/22)) ([189bd66](https://github.com/meyfa/recaptcha-promise/commit/189bd66673998890cfac661efe7400c99a5d5fb8))
* **deps:** update dependency axios to ^0.26.0 ([#30](https://github.com/meyfa/recaptcha-promise/issues/30)) ([20e013f](https://github.com/meyfa/recaptcha-promise/commit/20e013f747c507266730774072678e3ba2f7ef6f))
* **deps:** update dependency axios to ^0.27.0 ([#41](https://github.com/meyfa/recaptcha-promise/issues/41)) ([4fdd277](https://github.com/meyfa/recaptcha-promise/commit/4fdd2776f20abc2d796f652c8f64579c4068aa82))
* **deps:** update dependency axios to v1 ([#73](https://github.com/meyfa/recaptcha-promise/issues/73)) ([4b062da](https://github.com/meyfa/recaptcha-promise/commit/4b062da7ab3708172a6f03463738b789f346975b))

## [2.0.0](https://github.com/meyfa/recaptcha-promise/compare/v1.1.0...v2.0.0) (2021-11-28)


### What's Changed

* feat: Convert everything to TypeScript ([#10](https://github.com/meyfa/recaptcha-promise/pull/10))
* chore: Add nyc and set up coverage reporting via CI and CodeClimate ([#11](https://github.com/meyfa/recaptcha-promise/pull/11))
* test: Refactor tests using simplified async/await ([#12](https://github.com/meyfa/recaptcha-promise/pull/12))

## [1.1.0](https://github.com/meyfa/recaptcha-promise/compare/v1.0.0...v1.1.0) (2021-09-14)


### What's Changed

* Dependency updates (PRs #1, #2, #3, #4, #5, #6, #8)
* Improvement of project metadata (npm files array instead of `.npmignore`, etc) (#8)
* GitHub Actions (#9)

## [1.0.0](https://github.com/meyfa/recaptcha-promise/compare/v0.1.3...v1.0.0) (2020-10-09)


### What's Changed

**Hooray! A major release! This release is 100% backwards-compatible, except for the minimum Node version (v10.0.0).**
Still, `recaptcha-promise` has matured enough to warrant a 1.0.0.

* Add methods for creating locally-configured instances (dee22509045899d0da19987e8da63abc40c17042)
* Specify minimum Node version: 10.0.0 or newer (276d53ca07c9d496d909af31292da027e5fd22f4)

Modernizations behing the scenes:

* Rewrite with `async` and Axios library, instead of Bluebird and Request (ed866307bd61e1cbc26dab09262338cca808ab8b)
* Use JS Standard style and configure linting (12250439206f941577070abe431cbf4f054a61f7)
* Add package-lock.json (12250439206f941577070abe431cbf4f054a61f7)

Misc.:

* Setup Travis CI (7e0f0425994a2ecbbbeb1dfb23198cbba27e2e1c)
* Create unit tests (100c963643f176f4a742e432ef293cdd71537290, bcd5c92651a9f39ac07ed475be188601c53911ca)
* Add .npmignore (46de9216169937effc750abe1add4c70a3c42b24)

## [0.1.3](https://github.com/meyfa/recaptcha-promise/compare/v0.1.2...v0.1.3) (2017-07-26)


### What's Changed

* Reduce amount of unneeded empty lines (582b5ec68b332c3fa54194ecc6fa153fa2c00511)
* Update repo data and license year (ae87cefafcd70946051404364edeb3800add18ae)

## [0.1.2](https://github.com/meyfa/recaptcha-promise/compare/v0.1.1...v0.1.2) (2016-07-31)


### What's Changed

- Point out optionality of remote_address in example

## [0.1.1](https://github.com/meyfa/recaptcha-promise/compare/v0.1.0...v0.1.1) (2016-07-19)


### What's Changed

- Make usage example more clear

## [0.1.0](https://github.com/meyfa/recaptcha-promise/releases/tag/v0.1.0) (2016-07-19)


### What's Changed

- Add better description, usage, license to README
- Add initial code & package.json
- Initial commit
