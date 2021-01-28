import { MetaDataItemsObject, MetaDataObject } from './common/types'

export const CURIE = {
    ALWAYS_PREFIXED: ["RHEA", "GO", "CHEBI", "HP", "MONDO", "DOID", "EFO", "UBERON", "MP", "CL", "MGI"]
}

export const TIMEOUT = 30000;

export const MAX_Biothings_Input_Size = 1000;

export const APIMETA: MetaDataItemsObject = {
    "Gene": {
        "id_ranks": ["NCBIGene", "ENSEMBL", "HGNC", "SYMBOL", "OMIM", "UniProtKB", "UMLS", "MGI", "name"],
        "semantic": "Gene",
        "api_name": "mygene.info",
        "url": "https://mygene.info/v3/query",
        "mapping": {
            "NCBIGene": ["entrezgene"],
            "name": ["name"],
            "SYMBOL": ["symbol"],
            "UMLS": ["umls.cui", "umls.protein_cui"],
            "HGNC": ["HGNC"],
            "UNIPROTKB": ["uniprot.Swiss-Prot"],
            "ENSEMBL": ["ensembl.gene"],
            "OMIM": ["OMIM"],
            "MGI": ["MGI"]
        }
    },
    "SequenceVariant": {
        "id_ranks": ["HGVS", "DBSNP", "MYVARIANT_HG19", "ClinVar"],
        "api_name": "myvariant.info",
        "semantic": "SequenceVariant",
        "url": 'https://myvariant.info/v1/query',
        "mapping": {
            "MYVARIANT_HG19": ["_id"],
            "DBSNP": ["dbsnp.rsid", "clinvar.rsid", "dbnsfp.rsid"],
            "HGVS": ["clinvar.hgvs.genomic", "clinvar.hgvs.protein", "clinvar.hgvs.coding"],
            "ClinVar": ["clinvar.rcv.accession"]
        }
    },
    "ChemicalSubstance": {
        "id_ranks": ["CHEBI", "CHEMBL.COMPOUND", "DRUGBANK", "PUBCHEM", "MESH", "INCHI", "INCHIKEY", "UNII", "KEGG", "UMLS", "name"],
        "semantic": "ChemicalSubstance",
        "api_name": "mychem.info",
        "url": "https://mychem.info/v1/query",
        "mapping": {
            "CHEMBL.COMPOUND": ["chembl.molecule_chembl_id", "drugbank.xrefs.chembl", "drugcentral.xrefs.chembl_id"],
            "DRUGBANK": ["drugcentral.xrefs.drugbank_id", "pharmgkb.xrefs.drugbank", "chebi.xrefs.drugbank", "drugbank.id"],
            "PUBCHEM": ["pubchem.cid", "drugbank.xrefs.pubchem.cid", "drugcentral.xrefs.pubchem_cid", "pharmgkb.xrefs.pubchem.cid"],
            "CHEBI": ["chebi.id", "chembl.chebi_par_id", "drugbank.xrefs.chebi", "drugcentral.xrefs.chebi"],
            "UMLS": ["drugcentral.xrefs.umlscui", "pharmgkb.xrefs.umls", "umls.cui"],
            "MESH": ["umls.mesh", "drugcentral.xrefs.mesh_descriptor_ui", "ginas.xrefs.MESH", "pharmgkb.xrefs.mesh"],
            "UNII": ["drugcentral.xrefs.unii", "unii.unii", "aeolus.unii", "ginas.unii"],
            "INCHIKEY": ["drugbank.inchi_key", "ginas.inchikey", "unii.inchikey", "chebi.inchikey"],
            "INCHI": ["drugbank.inchi", "chebi.inchi", "chembl.inchi"],
            "KEGG": ["drugbank.xrefs.kegg.cid"],
            "name": ["chembl.pref_name", "drugbank.name", "umls.name", "ginas.preferred_name", "pharmgkb.name", "chebi.name"]
        }
    },
    "Disease": {
        "id_ranks": ["MONDO", "DOID", "OMIM", "ORPHANET", "EFO", "UMLS", "MESH", "HP", "name"],
        "semantic": "Disease",
        "api_name": "mydisease.info",
        "url": "https://mydisease.info/v1/query",
        "mapping": {
            "MONDO": ["mondo.mondo"],
            "DOID": ["mondo.xrefs.doid"],
            "UMLS": ['mondo.xrefs.umls', "disgenet.xrefs.umls"],
            "name": ["mondo.label", "disgenet.xrefs.disease_name"],
            "MESH": ["mondo.xrefs.mesh", "disease_ontology.xrefs.mesh", "ctd.mesh"],
            "OMIM": ["mondo.xrefs.omim", "hpo.omim"],
            "EFO": ["mondo.xrefs.efo"],
            "ORPHANET": ["hpo.orphanet", "mondo.xrefs.orphanet"],
            "HP": ["mondo.xrefs.hp"]
        }
    },
    "DiseaseOrPhenotypicFeature": {
        "id_ranks": ["MONDO", "DOID", "OMIM", "ORPHANET", "EFO", "UMLS", "MESH", "HP", "name"],
        "semantic": "Disease",
        "api_name": "mydisease.info",
        "url": "https://mydisease.info/v1/query",
        "mapping": {
            "MONDO": ["mondo.mondo"],
            "DOID": ["mondo.xrefs.doid"],
            "UMLS": ['mondo.xrefs.umls', "disgenet.xrefs.umls"],
            "name": ["mondo.label", "disgenet.xrefs.disease_name"],
            "MESH": ["mondo.xrefs.mesh", "disease_ontology.xrefs.mesh", "ctd.mesh"],
            "OMIM": ["mondo.xrefs.omim", "hpo.omim"],
            "EFO": ["mondo.xrefs.efo"],
            "ORPHANET": ["hpo.orphanet", "mondo.xrefs.orphanet"],
            "HP": ["mondo.xrefs.hp"]
        }
    },
    "PhenotypicFeature": {
        "id_ranks": ["UMLS", "SNOMEDCT", "HP", "MEDDRA", "EFO", "NCIT", "MESH", "MP", "name"],
        "semantic": "PhenotypicFeature",
        "api_name": "HPO API",
        "url": "https://biothings.ncats.io/hpo/query",
        "mapping": {
            "UMLS": ["xrefs.umls"],
            "SNOMEDCT": ["xrefs.snomed_ct"],
            "HP": ["_id"],
            "MEDDRA": ["xrefs.meddra"],
            "EFO": ["xrefs.efo"],
            "NCIT": ["xrefs.ncit"],
            "MESH": ["xrefs.mesh"],
            "MP": ["xrefs.mp"],
            "name": ["name"]
        }
    },
    "MolecularActivity": {
        "id_ranks": ["GO", "MetaCyc", "RHEA", "KEGG", "REACT", "name"],
        "semantic": "MolecularActivity",
        "api_name": "Gene Ontology Molecular Function API",
        "url": "https://biothings.ncats.io/go_mf/query",
        "mapping": {
            "GO": ["_id"],
            "MetaCyc": ["xrefs.metacyc"],
            "RHEA": ["xrefs.rhea"],
            "KEGG": ["xrefs.kegg_reaction"],
            "REACT": ["xrefs.reactome"],
            "name": ["name"]
        }
    },
    "BiologicalProcess": {
        "id_ranks": ["GO", "MetaCyc", "REACT", "KEGG", "name"],
        "semantic": "BiologicalProcess",
        "api_name": "Gene Ontology Biological Process API",
        "url": "https://biothings.ncats.io/go_bp/query",
        "mapping": {
            "GO": ["_id"],
            "MetaCyc": ["xrefs.metacyc"],
            "KEGG": ["xrefs.kegg_pathway"],
            "REACT": ["xrefs.reactome"],
            "name": ["name"]
        }
    },
    "CellularComponent": {
        "id_ranks": ["GO", "MetaCyc", "RHEA", "name"],
        "semantic": "CellularComponent",
        "api_name": "Gene Ontology Cellular Component API",
        "url": "https://biothings.ncats.io/go_cc/query",
        "mapping": {
            "GO": ["_id"],
            "MetaCyc": ["xrefs.metacyc"],
            "RHEA": ["xrefs.rhea"],
            "name": ["name"]
        }
    },
    "Pathway": {
        "id_ranks": ["REACT", "KEGG", "PHARMGKB", "WIKIPATHWAYS", "name"],
        "semantic": "Pathway",
        "api_name": "geneset API",
        "url": "https://biothings.ncats.io/geneset/query",
        "mapping": {
            "Reactome": ["reactome"],
            "WIKIPATHWAYS": ["wikipathways"],
            "KEGG": ["kegg"],
            "PHARMGKB": ['pharmgkb'],
            "name": ["name"]
        }
    },
    "AnatomicalEntity": {
        "id_ranks": ["UBERON", "UMLS", "MESH", "NCIT", "name"],
        "semantic": "AnatomicalEntity",
        "api_name": "UBERON API",
        "url": "https://biothings.ncats.io/uberon/query",
        "mapping": {
            "UBERON": ["_id"],
            "UMLS": ["xrefs.umls"],
            "MESH": ["xrefs.mesh"],
            "NCIT": ["xrefs.ncit"],
            "name": ["name"]
        }
    },
    "Cell": {
        "id_ranks": ["CL", "NCIT", "MESH", "EFO", "name"],
        "semantic": "Cell",
        "api_name": "Cell Onotlogy API",
        "url": "https://biothings.ncats.io/cell_ontology/query",
        "mapping": {
            "CL": ["_id"],
            "NCIT": ["xrefs.ncit"],
            "MESH": ["xrefs.mesh"],
            "EFO": ["xrefs.efo"],
            "name": ["name"]
        }
    }
}

