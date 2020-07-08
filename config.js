exports.CURIE = {
    ALWAYS_PREFIXED: ["GO", "CHEBI", "HP", "MONDO", "DOID", "EFO", "UBERON", "MP", "CL"]
}
exports.APIMETA = {
    "Gene": {
        "id_ranks": ["NCBIGene", "ENSEMBL", "HGNC", "SYMBOL", "OMIM", "UniProtKB", "UMLS", "name"],
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
        "id_ranks": ["MONDO", "DOID", "OMIM", "ORPHANET", "EFO", "UMLS", "MESH", "name"],
        "semantic": "Disease",
        "api_name": "mydisease.info",
        "url": "https://mydisease.info/v1/query",
        "mapping": {
            "MONDO": ["mondo.mondo"],
            "DOID": ["mondo.xrefs.doid"],
            "UMLS": ['mondo.xrefs.umls', "disgenet.xrefs.umls"],
            "name": ["mondo.label", "disgenet.xrefs.disease_name"],
            "MESH": ["mondo.xrefs.mesh", "ctd.mesh"],
            "OMIM": ["mondo.xrefs.omim", "hpo.omim"],
            "EFO": ["mondo.xrefs.efo"],
            "ORPHANET": ["hpo.orphanet", "mondo.xrefs.orphanet"]
        }
    },
    "MolecularActivity": {
        "api_name": "NodeNormalization API",
        "url": "https://nodenormalization-sri.renci.org/get_normalized_nodes"
    },
    "BiologicalProcess": {
        "api_name": "NodeNormalization API",
        "url": "https://nodenormalization-sri.renci.org/get_normalized_nodes"
    },
    "CellularComponent": {
        "api_name": "NodeNormalization API",
        "url": "https://nodenormalization-sri.renci.org/get_normalized_nodes"
    },
    "Pathway": {
        "id_ranks": ["Reactome", "KEGG", "PHARMGKB", "WIKIPATHWAYS", "name"],
        "semantic": "Pathway",
        "api_name": "geneset API",
        "url": "https://biothings.ncats.io/geneset",
        "mapping": {
            "Reactome": ["reactome"],
            "WIKIPATHWAYS": ["wikipathways"],
            "KEGG": ["kegg"],
            "PHARMGKB": ['pharmgkb'],
            "name": ["name"]
        }
    },
    "AnatomicalEntity": {
        "api_name": "NodeNormalization API",
        "url": "https://nodenormalization-sri.renci.org/get_normalized_nodes"
    },
    "PhenotypicFeature": {
        "api_name": "NodeNormalization API",
        "url": "https://nodenormalization-sri.renci.org/get_normalized_nodes"
    },
    "Cell": {
        "api_name": "NodeNormalization API",
        "url": "https://nodenormalization-sri.renci.org/get_normalized_nodes"
    }
}