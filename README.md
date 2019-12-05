[![Build Status](https://travis-ci.com/kevinxin90/id_converter.js.svg?branch=master)](https://travis-ci.com/kevinxin90/id_converter.js)
[![Coverage Status](https://coveralls.io/repos/github/kevinxin90/id_converter.js/badge.svg?branch=master)](https://coveralls.io/github/kevinxin90/id_converter.js?branch=master)

# biomedical_id_resolver.js
js library for resolving biological ids to their equivalent ids in batch

## Install

```
$ npm install biomedical-id-resolver
```

## Usage

```js
const convert = require('biomedical-id-resolver');

const ids = ['entrez:1017', 'entrez:1018', 'hgnc:1177'];

(async () => {
	console.log(await convert(ids, semantic_type='Gene'));
	//=> {'entrez:1017': {...}, 'entrez:1018': {...}, 'hgnc:1177': {...}}
})();
```

## Available Semantic Types & prefixes
* Gene
    * entrez
    * ensembl
    * umls
    * name
    * symbol
    * hgnc
    * omim

* SequenceVariant
    * dbsnp
    * hgvs

* ChemicalSubstance
    * chembl
    * drugbank
    * name
    * pubchem
    * umls
    * mesh

* DiseaseOrPhenotypicFeature
    * mondo
    * doid
    * hp
    * umls
    * mesh
    * name

* Pathway
    * name
    * reactome
    * wikipathways
    * kegg
    * pharmgkb
    * biocarta

* MolecularActivity
    * name
    * go

* CellularComponent
    * go
    * name
    * umls

* BiologicalProcess
    * go
    * name
    * umls

* AnatomicalEntity
    * name
    * umls

* phenotype
    * name
    * umls

