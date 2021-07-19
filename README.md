![Test Coveralls](https://github.com/biothings/biomedical_id_resolver.js/workflows/Test%20Coveralls/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/biothings/biomedical_id_resolver.js/badge.svg?branch=main)](https://coveralls.io/github/biothings/biomedical_id_resolver.js?branch=main)
![npm](https://img.shields.io/npm/dw/biomedical_id_resolver)
![GitHub issues](https://img.shields.io/github/issues/biothings/biomedical_id_resolver.js)
![NPM](https://img.shields.io/npm/l/biomedical_id_resolver)
![npm](https://img.shields.io/npm/v/biomedical_id_resolver?style=plastic)
![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/biothings/biomedical_id_resolver.js)



# biomedical_id_resolver.js
js library for resolving biological ids to their equivalent ids in batch

## Install

```
$ npm i biomedical_id_resolver
```

## Usage

```js
const resolve = require('biomedical_id_resolver');

// input should be an object, with semantic type as the key, and array of CURIEs as value
let input = {
    "Gene": ["NCBIGene:1017", "NCBIGene:1018", "HGNC:1177"],
    "ChemicalSubstance": ["CHEBI:15377"],
    "Disease": ["MONDO:0004976"],
    "Cell": ["CL:0002372"]
  };

(async () => {
  const resolver = new resolve();
	console.log(await resolver.resolve(input);
	//=> {'NCBIGene:1017': {...}, 'NCBIGene:1018': {...}, 'HGNC:1177': {...}, 'CHEBI:15377': {...}, 'MONDO:0004976': {...}, 'CL:0002372': {...}}
})();

```

## Output Schema

- Output is a javascript Object

- The root keys are CURIES (e.g. NCBIGene:1017) which are passed in as input

- The values represents resolved identifiers

- Each CURIE will have 4 required fields

  - id: the primary id (selected based on the ranking described in the next section) and label

  - curies: an array, each element represents a resolved id in CURIE format

  - type: the semantic type of the identifier

  - db_ids: original ids from source database, could be curies or non-curies.


- if an ID can not be resolved using the package, it will have an additional field called "flag", with value equal to "failed"

- Example Output

```json
{
  "NCBIGene:1017": {
    "id": {
      "label": "cyclin dependent kinase 2",
      "identifier": "NCBIGene:1017"
    },
    "db_ids": {
      "NCBIGene": [
        "1017"
      ],
      "ENSEMBL": [
        "ENSG00000123374"
      ],
      "HGNC": [
        "1771"
      ],
      "SYMBOL": [
        "CDK2"
      ],
      "UMLS": [
        "C1332733",
        "C0108855"
      ],
      "name": [
        "cyclin dependent kinase 2"
      ]
    },
    "type": "Gene",
    "curies": [
      "NCBIGene:1017",
      "ENSEMBL:ENSG00000123374",
      "HGNC:1771",
      "SYMBOL:CDK2",
      "UMLS:C1332733",
      "UMLS:C0108855"
    ]
  }
}
```

## Available Semantic Types & prefixes

> Gene, Transcript, Protein ID resolution is done through MyGene.info API

- Gene
  1. NCBIGene
  2. ENSEMBL
  3. HGNC
  4. SYMBOL
  5. OMIM
  6. UniProtKB
  7. UMLS
  8. MGI
  9. name

- Transcript
  1. ENSEMBL
  2. SYMBOL
  3. name

- Protein
  1. UniProtKB
  2. ENSEMBL
  3. SYMBOL
  4. UMLS
  5. name

> Variant ID resolution is done through MyVariant.info API

- SequenceVariant
  1. HGVS
  2. DBSNP
  3. MYVARIANT_HG19
  4. ClinVar

> ChemicalSubstance, Drug ID resolution is done through MyChem.info API

- ChemicalSubstance
    1. CHEBI
    2. CHEMBL.COMPOUND
    3. DRUGBANK
    4. PUBCHEM.COMPOUND
    5. MESH
    6. INCHI
    7. INCHIKEY
    8. UNII
    9. KEGG.COMPOUND
    10. UMLS
    11. LINCS
    12. name

- Drug
    1. CHEBI
    2. CHEMBL.COMPOUND
    3. DRUGBANK
    4. PUBCHEM.COMPOUND
    5. MESH
    6. INCHI
    7. INCHIKEY
    8. UNII
    9. KEGG.COMPOUND
    10. UMLS
    11. LINCS
    12. name

> Disease ID Resolution is done through MyDisease.info API

- Disease

  1. MONDO
  2. DOID
  3. OMIM
  4. ORPHANET
  5. SNOMEDCT
  6. NCIT
  7. EFO
  8. UMLS
  9. MESH
  10. HP
  11. GARD
  12. name

> Pathway ID Resolution is done through biothings.ncats.io/geneset API

- Pathway
  1. REACT
  2. KEGG
  3. PHARMGKB.PATHWAYS
  4. WIKIPATHWAYS
  5. BIOCARTA
  6. name

> MolecularActivity ID Resolution is done through BioThings Gene Ontology Molecular Activity API

- MolecularActivity
  1. GO
  2. MetaCyc
  3. RHEA
  4. KEGG.REACTION
  5. REACT
  6. name

> CellularComponent ID Resolution is done through BioThings Gene Ontology Cellular Component API

- CellularComponent
  1. GO
  2. name

> BiologicalProcess ID Resolution is done through BioThings Gene Ontology Biological Process API

- BiologicalProcess

  1. GO
  2. MetaCyc
  3. REACT
  4. name

> AnatomicalEntity ID Resolution is done through BioThings UBERON API

- AnatomicalEntity
  1. UBERON
  2. UMLS
  3. MESH
  4. name

> PhenotypicFeature ID Resolution is done through BioThings HPO API

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

> Cell ID Resolution is done through Biothings Cell Ontology API

- Cell
  1. CL
  2. NCIT
  3. MESH
  4. name

## Development

1. Install Node 12 or later. You can use the [package manager](https://www.npmjs.com/) of your choice.
   Tests need to pass in Node 12 and 14.
2. Clone this repository.
3. Run `npm ci` to install the dependencies.
4. scripts are stored in `/src` folder
5. Add test to `/__tests__` folder
6. run `npm run release` to bump version and generate change log
7. run `npx depcheck` to check for unused packages in package.json

## CHANGELOG

See [CHANGELOG.md](https://github.com/biothings/biomedical_id_resolver.js/blob/main/CHANGELOG.md)
