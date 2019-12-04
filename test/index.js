const expect = require("chai").expect;
const findAPIByType = require('../index').findAPIByType;
const apiCall = require('../index').constructPostQuery;
const generateAPIPromisesByCuries = require("../index").generateAPIPromisesByCuries;
const _ = require('lodash');

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
        expect(apiCall([], 'hgnc', api)).undefined;
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
    it("if curies is empty, should return an empty array", function() {
        let curies = [];
        let res = generateAPIPromisesByCuries(curies, 'Gene');
        expect(res).to.be.an('array').that.is.empty;
    });
    it("if semantic type is not correct, should return an empty array", function() {
        let curies = ['entrez:1017'];
        let res = generateAPIPromisesByCuries(curies, 'Gene1');
        expect(res).to.be.an('array').that.is.empty;
    });
    it("if semantic type and curie prefix doesn't match, should return an empty array", function() {
        let curies = ['entrez:1017'];
        let res = generateAPIPromisesByCuries(curies, 'SequenceVariant');
        expect(res).to.be.an('array').that.is.empty;
    });
    it("the length of returned array should be equal to the number of prefixes", function() {
        let curies = ['entrez:1017', 'hgnc:1771'];
        let res = generateAPIPromisesByCuries(curies, 'Gene');
        expect(res).to.be.an('array').of.lengthOf(2);
        curies = ['entrez:1017', 'entrez:1771'];
        res = generateAPIPromisesByCuries(curies, 'Gene');
        expect(res).to.be.an('array').of.lengthOf(1);
    });
    it("if the input ids > 1000, should be chuncked into multiple promises", function() {
        let curies = [];
        let curie
        for (i=1; i<1001; i++) {
            curie = 'entrez:' + _.toString(i);
            curies.push(curie);
        };
        res = generateAPIPromisesByCuries(curies, 'Gene');
        expect(res).to.be.an('array').of.lengthOf(1);
        curies.push('entrez:1001');
        res = generateAPIPromisesByCuries(curies, 'Gene');
        expect(res).to.be.an('array').of.lengthOf(2);
    })
})
