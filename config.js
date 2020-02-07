exports.SEMANTIC2API = {
    "Gene": "mygene.info",
    "SequenceVariant": "myvariant.info",
    "ChemicalSubstance": ["mychem.info", "umlschem"],
    "DiseaseOrPhenotypicFeature": "mydisease.info",
    "AnatomicalEntity": "semmedanatomy",
    "PhenotypicFeature": "semmedphenotype",
    "Pathway": "pathway",
    "MolecularActivity": "mf",
    "CellularComponent": "cc",
    "BiologicalProcess": "bp"
}


exports.APIMETA = {
    "mygene.info": {
        "base_url": "http://mygene.info/v3/query",
        "semantic": "Gene",
        "field_mapping": {
            "entrez": "entrezgene",
            "ensembl": "ensembl.gene",
            "umls": "umls.cui",
            "name": "name",
            "symbol": "symbol",
            "hgnc": "HGNC",
            "omim": "MIM",
            "biothings": "_id"
        }
    },
    "myvariant.info": {
        "base_url": "http://myvariant.info/v1/query",
        "semantic": "SequenceVariant",
        "field_mapping": {
            "hgvs": "_id",
            "dbsnp": "dbsnp.rsid",
            "biothings": "_id"
        }
    },
    "mychem.info": {
        "base_url": "http://mychem.info/v1/query",
        "semantic": "ChemicalSubstance",
        "field_mapping": {
            "chembl": "chembl.molecule_chembl_id",
            "drugbank": "drugbank.id",
            "name": "chembl.pref_name",
            "pubchem": "pubchem.cid",
            "umls": "drugcentral.xrefs.umlscui",
            "mesh": "drugcentral.xrefs.mesh_descriptor_ui",
            "biothings": "_id",
            "drugPhase": "chembl.max_phase"
        }
    },
    "mydisease.info": {
        "base_url": "http://mydisease.info/v1/query",
        "semantic": "DiseaseOrPhenotypicFeature",
        "field_mapping": {
            "mondo": "_id",
            "doid": "mondo.xrefs.doid",
            "hp": "mondo.xrefs.hp",
            "umls": "mondo.xrefs.umls",
            "mesh": "mondo.xrefs.mesh",
            "name": "mondo.label",
            "biothings": "_id"
        }
    },
    "pathway": {
        "base_url": "http://pending.biothings.io/geneset/query",
        "add": " AND type:pathway",
        "semantic": "Pathway",
        "field_mapping": {
            "name": "name",
            "reactome": "reactome",
            "wikipathways": "wikipathways",
            "kegg": "kegg",
            "pharmgkb": "pharmgkb",
            "biocarta": "biocarta",
            "biothings": "_id"
        }
    },
    "mf": {
        "base_url": "http://pending.biothings.io/geneset/query",
        "add": " AND type:mf",
        "semantic": "MolecularActivity",
        "field_mapping": {
            "name": "name",
            "go": "go",
            "biothings": "_id"
        }
    },
    "cc": {
        "base_url": "http://pending.biothings.io/geneset/query",
        "add": " AND type:cc",
        "semantic": "CellularComponent",
        "field_mapping": {
            "name": "name",
            "go": "go",
            "umls": "umls",
            "biothings": "_id"
        }
    },
    "bp": {
        "base_url": "http://pending.biothings.io/geneset/query",
        "add": " AND type:bp",
        "semantic": "BiologicalProcess",
        "field_mapping": {
            "name": "name",
            "go": "go",
            "umls": "umls",
            "biothings": "_id"
        }
    },
    "anatomy": {
        "base_url": "http://pending.biothings.io/semmed_anatomy/query",
        "semantic": "AnatomicalEntity",
        "field_mapping": {
            "name": "name",
            "umls": "umls",
            "biothings": "_id"
        }
    },
    "phenotype": {
        "base_url": "http://pending.biothings.io/semmedphenotype/query",
        "semantic": "PhenotypicFeature",
        "field_mapping": {
            "name": "name",
            "umls": "umls",
            "biothings": "_id"
        }
    }
}