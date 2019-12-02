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


