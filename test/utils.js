const expect = require("chai").expect;
const findAPIByType = require('../index').findAPIByType;
const findAPIByBaseUrl = require('../index').findAPIByBaseUrl
const apiCall = require('../index').constructPostQuery;
const generateAPIPromisesByCuries = require("../index").generateAPIPromisesByCuries;
const transformAPIResponse = require('../index').transformAPIResponse;
const _ = require('lodash');
const axios = require('axios').default;
const resolve = require('../index').resolve;


describe("Test findAPIByBaseUrl functions", function() {
    it("if baseUrl provided is not string, return undefined", function() {
        let baseUrl = ['http://mygene.info'];
        expect(findAPIByBaseUrl(baseUrl)).undefined;
    });
    it("if no API found corresponding to baseUrl, return undefined", function() {
        let baseUrl = 'http://mygene.info';
        expect(findAPIByBaseUrl(baseUrl)).undefined;
    });
    it("right API found for right baseUrl", function() {
        let baseUrl = 'http://mygene.info/v3/query';
        expect(findAPIByBaseUrl(baseUrl)).to.equal('mygene.info');
    });
})

describe("Test findAPIByType functions", function() {
    it("if semantic type is not a string, return undefined", function() {
        let semantic_type = ['Gene', 'SequenceVariant'];
        expect(findAPIByType(semantic_type, 'umls')).undefined;
    });
    it("if id type is not a string, return undefined", function() {
        let id_type = ['umls', 'hgnc'];
        expect(findAPIByType('Gene', id_type)).undefined;
    });
    it("return API name as a string if matched", function() {
        let semantic_type = 'Gene';
        let id_type = 'umls';
        expect(findAPIByType(semantic_type, id_type)).to.equal('mygene.info');
    });
    it("return undefined if nothing matched", function() {
        let semantic_type = 'Gene';
        let id_type = 'dbsnp';
        expect(findAPIByType(semantic_type, id_type)).undefined;
        id_type = '';
        expect(findAPIByType(semantic_type, id_type)).undefined;
    });
})

describe("Test constructPostQuery function", function() {
    it("if inputs is empty, should return undefined", function() {
        expect(apiCall([], 'hgnc', 'mygene.info')).undefined;
    });
    it("if api is not in config, return undefined", function() {
        let api = 'mykkk.com';
        expect(apiCall(['1017', '1018'], 'hgnc', api)).undefined;
    });
    it("if prefix is not in api's fields, return undefined", function() {
        let api = 'mygene.info';
        let prefix = 'uuu';
        expect(apiCall(['1017', '1018'], prefix, api)).undefined;
    });
    it("return a axios promise for mygene.info", async function() {
        let api = 'mygene.info';
        let prefix = 'entrez';
        let ids = ['1017', '1018']
        let res = await apiCall(ids, prefix, api);
        expect(res.data).to.be.an.instanceof(Array).to.have.lengthOf(2);
        let res1 = res.data[0];
        expect(res1).to.include({'entrezgene': '1017', 'MIM': "116953", 'ensembl.gene': 'ENSG00000123374', 'HGNC': '1771', 'umls.cui': 'C1332733', 'symbol': 'CDK2', 'name': 'cyclin dependent kinase 2'});
        let res2 = res.data[1];
        expect(res2).to.include({'entrezgene': '1018', 'symbol': 'CDK3', 'name': 'cyclin dependent kinase 3'});
    });
})

describe("Test generateAPIPromisesByCuries function", function() {
    it("if curies contain non-curie values, should be stored in invalid field of the response", function() {
        let curies = [1017, 1018];
        let res = generateAPIPromisesByCuries(curies, 'Gene');
        expect(res['valid']).to.be.an('array').that.is.empty;
        expect(res['invalid']).to.be.an('array').of.lengthOf(2).that.includes('1017', '1018');
        curies = ['1017', '1018'];
        res = generateAPIPromisesByCuries(curies, 'Gene');
        expect(res['valid']).to.be.an('array').that.is.empty;
        expect(res['invalid']).to.be.an('array').of.lengthOf(2).that.includes('1017', '1018');
        curies = ['entrez:1017', '1018'];
        res = generateAPIPromisesByCuries(curies, 'Gene');
        expect(res['valid']).to.be.an('array').of.lengthOf(1);
        expect(res['invalid']).to.be.an('array').deep.equal(Array.from(['1018']));
    })
    it("if curies is empty, should return an empty array", function() {
        let curies = [];
        let res = generateAPIPromisesByCuries(curies, 'Gene');
        expect(res['valid']).to.be.an('array').that.is.empty;
        expect(res['invalid']).to.be.an('array').that.is.empty;
    });
    it("if semantic type is not correct, should return an empty array", function() {
        let curies = ['entrez:1017'];
        let res = generateAPIPromisesByCuries(curies, 'Gene1');
        expect(res['valid']).to.be.an('array').that.is.empty;
        expect(res['invalid']).to.be.an('array').that.is.empty;
    });
    it("if semantic type and curie prefix doesn't match, should return an empty array", function() {
        let curies = ['entrez:1017'];
        let res = generateAPIPromisesByCuries(curies, 'SequenceVariant');
        expect(res['valid']).to.be.an('array').that.is.empty;
        expect(res['invalid']).to.be.an('array').that.is.empty;
    });
    it("the length of returned array should be equal to the number of prefixes", function() {
        let curies = ['entrez:1017', 'hgnc:1771'];
        let res = generateAPIPromisesByCuries(curies, 'Gene');
        expect(res['valid']).to.be.an('array').of.lengthOf(2);
        curies = ['entrez:1017', 'entrez:1771'];
        res = generateAPIPromisesByCuries(curies, 'Gene');
        expect(res['valid']).to.be.an('array').of.lengthOf(1);
    });
    it("if the input ids > 1000, should be chuncked into multiple promises", function() {
        let curies = [];
        let curie
        for (i=1; i<1001; i++) {
            curie = 'entrez:' + _.toString(i);
            curies.push(curie);
        };
        res = generateAPIPromisesByCuries(curies, 'Gene');
        expect(res['valid']).to.be.an('array').of.lengthOf(1);
        curies.push('entrez:1001');
        res = generateAPIPromisesByCuries(curies, 'Gene');
        expect(res['valid']).to.be.an('array').of.lengthOf(2);
    })
})

describe("test transform API response function", function() {
    it("if API response is empty, return empty dict", function() {
        let res = {};
        expect(transformAPIResponse(res)).to.be.an('object').that.is.empty;
    });
    it("if base url could not be matched to API, return empty dict", function() {
        let res = {config: {url: 'http://mygene.info'}, data: {'entrez': 1}};
        expect(transformAPIResponse(res)).to.be.an('object').that.is.empty;
    });
    it("if scope info could not be extracted, return empty dict", function() {
        let res = {config: {url: 'http://mygene.info/v3/query', data: 'q=1017'}, data: {'entrez': 1}};
        expect(transformAPIResponse(res)).to.be.an('object').that.is.empty;
    });
    it("if scope could not be converted to biolink prefix, return empty dict", function() {
        let res = {config: {url: 'http://mygene.info/v3/query', data: 'q=1017&scopes=entrez&fiedlds=...'}, data: {'entrez': 1}};
        expect(transformAPIResponse(res)).to.be.an('object').that.is.empty;
    });
    it("if scope could not be converted to biolink prefix, return empty dict", function() {
        let res = {config: {url: 'http://mygene.info/v3/query', data: 'q=1017&scopes=entrez&fiedlds=...'}, data: {'entrez': 1}};
        expect(transformAPIResponse(res)).to.be.an('object').that.is.empty;
    });
    it("if data is, return empty dict", function() {
        let res = {config: {url: 'http://mygene.info/v3/query', data: 'q=1017&scopes=entrez&fiedlds=...'}, data: {'entrez': 1}};
        expect(transformAPIResponse(res)).to.be.an('object').that.is.empty;
    });
    it("API response should be transformed correctly", async function() {
        const response = await axios.post('http://mygene.info/v3/query',
                                          data='q=1017,1018&scopes=entrezgene&fields=name,symbol,entrezgene,MIM,HGNC,umls.cui&dotfield=true',
                                          headers={'content-type': 'application/x-www-form-urlencoded'});
        const curie_mapping = {'entrez:1017': 'entrez:1017', 'entrez:1018': 'entrez:1018'}
        const res = transformAPIResponse(response, curie_mapping);
        expect(res).to.have.all.keys('entrez:1017', 'entrez:1018');
        expect(res['entrez:1017']).to.have.all.keys('name', 'symbol', 'entrez', 'umls', 'hgnc', 'omim');
    });
    it("keys not in the mapping file should be removed", async function() {
        let response = await axios.post('http://mygene.info/v3/query',
                                          data='q=1017,1018&scopes=entrezgene&fields=name,symbol,entrezgene,MIM,HGNC,umls.cui&dotfield=true',
                                          headers={'content-type': 'application/x-www-form-urlencoded'});
        let curie_mapping = {'entrez:1017': 'entrez:1017', 'entrez:1018': 'entrez:1018'}
        let res = transformAPIResponse(response, curie_mapping);
        expect(res['entrez:1017']).to.not.have.any.keys('taxid');
        response = await axios.post('http://mychem.info/v1/query',
                                          data='q=CHEMBL744,CHEMBL1306&scopes=chembl.molecule_chembl_id&fields=chembl.molecule_chembl_id,drugbank.id,chembl.pref_name,pubchem.cid,drugcentral.xrefs.umlscui,drugcentral.xrefs.mesh_descriptor_ui&dotfield=true',
                                          headers={'content-type': 'application/x-www-form-urlencoded'});
        curie_mapping = {'chembl:CHEMBL744': 'chembl:CHEMBL744', 'chembl:CHEMBL1306': 'chembl:CHEMBL1306'};
        res = transformAPIResponse(response, curie_mapping);
        expect(res['chembl:CHEMBL744']).to.have.all.keys('chembl', 'drugbank', 'mesh', 'name', 'pubchem', 'umls');
        expect(res['chembl:CHEMBL744']).to.not.have.any.keys('chembl._license', 'chebi._license');
    });
})

describe("test resolve function", function() {
    it("invalid input should be captured and return as notfound", async function() {
        const curies = ['1017', '1018', 1019];
        let result = await resolve(curies, 'Gene');
        expect(result).to.be.an("Object").to.have.all.keys('1017', '1018', '1019');
        expect(result['1018']).to.be.an('Object').deep.equal({'notfound': true});
    })
    describe("test using gene ids", function() {
        // example containing all fields
        const example1 = {
            'entrez': '1017',
            'hgnc': '1771',
            'ensembl': 'ENSG00000123374',
            'omim': '116953',
            'symbol': 'CDK2',
            'umls': 'C1332733',
            'name': "cyclin dependent kinase 2"
        }
        // example with some missing fields
        const example2 = {
            'entrez': '100507480',
            'hgnc': "54390",
            "symbol": "LINC02853",
            "name": "long intergenic non-protein coding RNA 2853"
        }
        let res;
        let curie;
        it("test first example with all fields available", async function() {
            
            for (let key in example1) {
                if (key !== 'name'){
                    curie = key + ':' + example1[key];
                    res = await resolve([curie], 'Gene');
                    expect(res).deep.equal({[curie]: example1});
                }
            }
        })
        it("test example with some fields missing", async function() {
            for (let key in example2) {
                if (!(['name', 'symbol'].includes(key))){
                    curie = key + ':' + example2[key];
                    res = await resolve([curie], 'Gene');
                    expect(res).deep.equal({[curie]: example2});
                }
            }
        })
    })
    describe("test using sequence variant ids", function() {
        // example containing all fields
        const example1 = {
            'hgvs': 'chr6:g.42454850G>A',
            'dbsnp': 'rs12190874'
        }
        // example with some missing fields
        const example2 = {
            'hgvs': 'chr17:g.7230032C>T'
        }
        let res;
        let curie;
        it("test first example with all fields available", async function() {
            for (let key in example1) {
                curie = key + ':' + example1[key];
                res = await resolve([curie], 'SequenceVariant');
                expect(res).deep.equal({[curie]: example1});
            }
        })
        it("test example with some fields missing", async function() {
            for (let key in example2) {
                curie = key + ':' + example2[key];
                res = await resolve([curie], 'SequenceVariant');
                expect(res).deep.equal({[curie]: example2});
            }
        })
    })
    describe("test using chemical ids", function() {
        // example containing all fields
        const example1 = {
            'chembl': 'CHEMBL744',
            'drugbank': 'DB00740',
            'name': 'RILUZOLE',
            'pubchem': 5070,
            'umls': 'C0073379',
            'mesh': 'D019782'
        }
        // example with some missing fields
        const example2 = {
            'chembl': 'CHEMBL1309',
            'pubchem': 487643,
        }
        let res;
        let curie;
        it("test first example with all fields available", async function() {
            for (let key in example1) {
                curie = key + ':' + example1[key];
                res = await resolve([curie], 'ChemicalSubstance');
                expect(res).deep.equal({[curie]: example1});
            }
        })
        it("test example with some fields missing", async function() {
            for (let key in example2) {
                curie = key + ':' + example2[key];
                res = await resolve([curie], 'ChemicalSubstance');
                expect(res).deep.equal({[curie]: example2});
            }
        })
    })
    describe("test using disease ids", function() {
        // example containing all fields
        const example2 = {
            'mondo': 'MONDO:0016575',
            'doid': 'DOID:9562',
            'mesh': 'D002925',
            'umls': 'C0008780',
            'name': "primary ciliary dyskinesia"
        }
        // example with some missing fields
        const example1 = {
            'mondo': 'MONDO:0001561',
            'doid': 'DOID:3122',
            'mesh': 'D011707',
            'umls': 'C0034194',
            'name': "pyloric stenosis (disease)",
            'hp': 'HP:0002021'
        }
        let res;
        let curie;
        it("test first example with all fields available", async function() {
            
            for (let key in example1) {
                if (key !== 'name'){
                    curie = key + ':' + example1[key];
                    res = await resolve([curie], 'DiseaseOrPhenotypicFeature');
                    expect(res).deep.equal({[curie]: example1});
                }
            }
        })
        it("test example with some fields missing", async function() {
            for (let key in example2) {
                if (key !== 'name'){
                    curie = key + ':' + example2[key];
                    res = await resolve([curie], 'DiseaseOrPhenotypicFeature');
                    expect(res).deep.equal({[curie]: example2});
                }
            }
        })
    })
    describe("test using pathway ids", function() {
        // example for wikipathways
        const example1 = {
            'wikipathways': 'WP24',
            'name': 'Peptide GPCRs'
        }
        // example for reactome
        const example2 = {
            'reactome': 'R-HSA-109582',
            'name': 'Hemostasis'
        }
        // example for kegg pathways
        const example3 = {
            'kegg': 'hsa03010',
            'name': 'Ribosome - Homo sapiens (human)'
        }
        // example for pharmgkb pathways
        const example4 = {
            'pharmgkb': 'PA165948566',
            'name': 'Metformin Pathway, Pharmacodynamic'
        }
        // example for biocarta pathways
        const example5 = {
            'biocarta': 'hdacpathway',
            'name': 'control of skeletal myogenesis by hdac and calcium/calmodulin-dependent kinase (camk)'
        }
        let res;
        let curie;
        it("test wikipathways", async function() {
            for (let key in example1) {
                if (key !== 'name'){
                    curie = key + ':' + example1[key];
                    res = await resolve([curie], 'Pathway');
                    expect(res).deep.equal({[curie]: example1});
                }
            }
        })
        it("test reactome", async function() {
            for (let key in example2) {
                if (key !== 'name'){
                    curie = key + ':' + example2[key];
                    res = await resolve([curie], 'Pathway');
                    expect(res).deep.equal({[curie]: example2});
                }
            }
        })
        it("test kegg", async function() {
            for (let key in example3) {
                if (key !== 'name'){
                    curie = key + ':' + example3[key];
                    res = await resolve([curie], 'Pathway');
                    expect(res).deep.equal({[curie]: example3});
                }
            }
        })
        it("test pharmgkb", async function() {
            for (let key in example4) {
                if (key !== 'name'){
                    curie = key + ':' + example4[key];
                    res = await resolve([curie], 'Pathway');
                    expect(res).deep.equal({[curie]: example4});
                }
            }
        })
        it("test biocarta", async function() {
            for (let key in example5) {
                if (key !== 'name'){
                    curie = key + ':' + example5[key];
                    res = await resolve([curie], 'Pathway');
                    expect(res).deep.equal({[curie]: example5});
                }
            }
        })
    })
})