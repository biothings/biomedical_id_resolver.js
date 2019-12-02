[![Build Status](https://travis-ci.com/kevinxin90/id_converter.js.svg?branch=master)](https://travis-ci.com/kevinxin90/id_converter.js)
[![Coverage Status](https://coveralls.io/repos/github/kevinxin90/id_converter.js/badge.svg?branch=master)](https://coveralls.io/github/kevinxin90/id_converter.js?branch=master)

# id_converter.js
js library for converting biological ids in batch

## Install

```
$ npm install biomedical-id-converter
```

## Usage

```js
const convert = require('biomedical-id-converter');

const ids = ['entrez:1017', 'entrez:1018', 'hgnc:1177'];

(async () => {
	console.log(await convert(ids, semantic_type='Gene'));
	//=> {'entrez:1017': {...}, 'entrez:1018': {...}, 'hgnc:1177': {...}}
})();
```


