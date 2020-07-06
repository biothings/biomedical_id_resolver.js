[![Build Status](https://travis-ci.com/kevinxin90/biomedical_id_resolver.js.svg?branch=master)](https://travis-ci.com/kevinxin90/biomedical_id_resolver.js)
[![Coverage Status](https://coveralls.io/repos/github/kevinxin90/biomedical_id_resolver.js/badge.svg?branch=master)](https://coveralls.io/github/kevinxin90/biomedical_id_resolver.js?branch=master)

# biomedical_id_resolver.js
js library for resolving biological ids to their equivalent ids in batch

## Install

```
$ npm i biomedical_id_resolver
```

## Usage

```js
const resolver = require('biomedical_id_resolver');

// resolve a list of gene ids
const ids = ['entrez:1017', 'entrez:1018', 'hgnc:1177'];

(async () => {
	console.log(await resolver.resolve(ids, semantic_type='Gene'));
	//=> {'entrez:1017': {...}, 'entrez:1018': {...}, 'hgnc:1177': {...}}
})();

// resolve a list of chemical ids
const ids = ['chembl:CHEMBL744', 'pubchem:10976469', 'drugbank:DB00022'];
(async () => {
	console.log(await resolver.resolve(ids, semantic_type='ChemicalSubstance'));
	//=> {'chembl:CHEMBL744': {...}, 'pubchem:10976469': {...}, 'drugbank:DB00022': {...}}
})();
```

## Available Semantic Types & prefixes

> Gene ID resolution is done through MyGene.info API

- Gene
  1. NCBIGene
  2. ENSEMBL
  3. HGNC
  4. SYMBOL
  5. OMIM
  6. UniProtKB
  7. UMLS
  8. name

> Variant ID resolution is done through MyVariant.info API

- SequenceVariant
  1. HGVS
  2. DBSNP
  3. MYVARIANT_HG19

> ChemicalSubstance ID resolution is done through MyChem.info API

- ChemicalSubstance
    1. CHEBI
    2. CHEMBL.COMPOUND
    3. DRUGBANK
    4. PUBCHEM
    5. MESH
    6. INCHI
    7. INCHIKEY
    8. UNII
    9. KEGG
    10. UMLS
    11. name

> Disease ID Resolution is done through MyDisease.info API

- Disease

  1. MONDO
  2. DOID
  3. OMIM
  4. ORPHANET
  5. EFO
  6. UMLS
  7. MESH
  8. name

> Pathway ID Resolution is done through biothings.ncats.io/geneset API

- Pathway
  1. Reactome
  2. KEGG
  3. PHARMGKB
  4. WIKIPATHWAYS
  5. name

> MolecularActivity ID Resolution is done through nodenormalization API

- MolecularActivity
  1. GO
  2. MetaCyc
  3. RHEA
  4. KEGG.REACTION
  5. Reactome

> CellularComponent ID Resolution is done through nodenormalization API

- CellularComponent
  1. GO
  2. MESH
  3. UMLS
  4. NCIT
  5. SNOMEDCT
  6. UBERON
  7. CL
  8. name

> BiologicalProcess ID Resolution is done through nodenormalization API

- BiologicalProcess

  1. GO
  2. MetaCyc
  3. Reactome
  4. name

> AnatomicalEntity ID Resolution is done through nodenormalization API

- AnatomicalEntity
  1. UBERON
  2. UMLS
  3. NCIT
  4. MESH
  5. name

> PhenotypicFeature ID Resolution is done through nodenormalization API

- PhenotypicFeature
  1. UMLS
  2. SNOMEDCT
  3. HP
  4. MEDDRA
  5. EFO
  6. NCIT
  7. MESH
  8. MP
  9. name

> Cell ID Resolution is done through nodenormalization API

- Cell
  1. CL
  2. UMLS
  3. NCIT
  4. MESH
  5. UBERON
  6. SNOMEDCT
  7. name
