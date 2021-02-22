# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.3.1](https://github.com/kevinxin90/biomedical_id_resolver.js/compare/v2.3.0...v2.3.1) (2021-02-22)


### Bug Fixes

* :bug: enforce all values of dbIDs as an array of strings ([4f1d54b](https://github.com/kevinxin90/biomedical_id_resolver.js/commit/4f1d54b77c16a70f54c3e0cdceb2d5033b6995e0))

## [2.3.0](https://github.com/kevinxin90/biomedical_id_resolver.js/compare/v2.2.1...v2.3.0) (2021-02-18)


### Features

* :sparkles: add an option to generate invalid inputs for all user Input ([49d9a40](https://github.com/kevinxin90/biomedical_id_resolver.js/commit/49d9a401860b7b3d9404abe90be640fa9362a7b9))
* :sparkles: support for input with undefined semantic type ([f92c87f](https://github.com/kevinxin90/biomedical_id_resolver.js/commit/f92c87f986dd4492c2cf43fae296ebe1b4543a2d))


### Bug Fixes

* :bug: fix wrong field name for Gene OMIM ID ([cd02a44](https://github.com/kevinxin90/biomedical_id_resolver.js/commit/cd02a44465253b764a410c9e3fbb8bf98ea67098))


### Refactor

* :recycle: add function to generate id to type dict based on config ([ddfd505](https://github.com/kevinxin90/biomedical_id_resolver.js/commit/ddfd50511b2e2904440fed5b9ea45ef927388f50))
* :recycle: check if id already exists in result before add invalid bioentity ([4e94038](https://github.com/kevinxin90/biomedical_id_resolver.js/commit/4e94038683f13c615bd05b46d2a7e37c52f04c52))

### [2.2.1](https://github.com/kevinxin90/biomedical_id_resolver.js/compare/v2.2.0...v2.2.1) (2021-02-14)

## [2.2.0](https://github.com/kevinxin90/biomedical_id_resolver.js/compare/v2.1.1...v2.2.0) (2021-02-14)


### Features

* :sparkles: return itself as dbid if it's invalid ([8041f03](https://github.com/kevinxin90/biomedical_id_resolver.js/commit/8041f0392e0aacf742ca7c8fe69db2b5045b389c))

### [2.1.1](https://github.com/kevinxin90/biomedical_id_resolver.js/compare/v2.1.0...v2.1.1) (2021-02-13)


### Bug Fixes

* :bug: fix curie construction bug ([de8b7ae](https://github.com/kevinxin90/biomedical_id_resolver.js/commit/de8b7aefa49808492fc4469fd735012499be6276))

## [2.1.0](https://github.com/kevinxin90/biomedical_id_resolver.js/compare/v2.0.2...v2.1.0) (2021-01-29)


### Features

* :sparkles: add debug if api query fails ([86e691f](https://github.com/kevinxin90/biomedical_id_resolver.js/commit/86e691feb9331aaada09bedea885b0f30ef1493e))
* :sparkles: Have ValidBioEntity and InValidBioEntity derive from abstract class BioEntity ([352d2a1](https://github.com/kevinxin90/biomedical_id_resolver.js/commit/352d2a15286bd9b343757685a78bcddce6b55a30))
* :sparkles: integrate npm debug module for debugging ([2b1cc72](https://github.com/kevinxin90/biomedical_id_resolver.js/commit/2b1cc72ef48830948b72551eeb2ac58d37702a8c))


### Refactor

* :fire: remove empty constructor for IDResolver ([94c0718](https://github.com/kevinxin90/biomedical_id_resolver.js/commit/94c07184cf2e0f2680bd42fbcea18c91c4a8f2aa))
* :fire: remove unused functions ([51b7605](https://github.com/kevinxin90/biomedical_id_resolver.js/commit/51b7605cccbd8d4a68a11942186649ad7436b6e5))
* :recycle: fix linting error ([3696995](https://github.com/kevinxin90/biomedical_id_resolver.js/commit/369699586f8756591886e8a79fdcee7912cddbb5))
* :recycle: fix typescript linting error ([f55ac5a](https://github.com/kevinxin90/biomedical_id_resolver.js/commit/f55ac5aedc6a92b1e4d84186ad6eab0a4e262e50))
* :recycle: fix typescript linting errors ([22a54b4](https://github.com/kevinxin90/biomedical_id_resolver.js/commit/22a54b432403119bcc54bcd506a7836b1bf7f0ac))
* :recycle: import debug the correct way in TypeScript ([1d25ac3](https://github.com/kevinxin90/biomedical_id_resolver.js/commit/1d25ac3fd7ceadbf659aa01a7cd02e4350467a31))
* :recycle: import debug the correct way in TypeScript ([c50f763](https://github.com/kevinxin90/biomedical_id_resolver.js/commit/c50f7630109d4f9e06d5b38ce407cbbb39564e8e))

### [2.0.2](https://github.com/kevinxin90/biomedical_id_resolver.js/compare/v2.0.1...v2.0.2) (2021-01-28)

### [2.0.1](https://github.com/kevinxin90/biomedical_id_resolver.js/compare/v2.0.0...v2.0.1) (2021-01-28)


### Bug Fixes

* :bug: point entry point to built folder ([0e56cf2](https://github.com/kevinxin90/biomedical_id_resolver.js/commit/0e56cf2515972982f147afa224437fffa5920d79))

## [2.0.0](https://github.com/kevinxin90/biomedical_id_resolver.js/compare/v0.1.1...v2.0.0) (2021-01-28)


### Features

* :boom: improve oop design of the ID Resolver module ([31a60f5](https://github.com/kevinxin90/biomedical_id_resolver.js/commit/31a60f5acef3c01d3098e388bbde5f4bc167415f))
* :sparkles: add validator feature ([22b03ee](https://github.com/kevinxin90/biomedical_id_resolver.js/commit/22b03eeaf898f257f27d8a59de99499dc8855c9f))


### Bug Fixes

* :bug: add colon between prefix and colon in generateCuries output ([175f98f](https://github.com/kevinxin90/biomedical_id_resolver.js/commit/175f98f91f645204f92ce55b41dc7f208c83d648))


### Refactor

* :fire: remove unused files ([305ddd1](https://github.com/kevinxin90/biomedical_id_resolver.js/commit/305ddd1cd965a41c5ada875824598b6ecd708a43))
* :recycle: add invalidbioentityclass ([dbe402b](https://github.com/kevinxin90/biomedical_id_resolver.js/commit/dbe402bd2b14c31a41321b792388a0b00810bbb5))
* :recycle: add scheduler class ([fa56046](https://github.com/kevinxin90/biomedical_id_resolver.js/commit/fa56046e1fa34ae5a30001029164798c8b571371))
* :recycle: create BioThings API Class to build axios query and parse response ([1adadb1](https://github.com/kevinxin90/biomedical_id_resolver.js/commit/1adadb1d02a7d57fda340d074bc5d063fa042f47))
