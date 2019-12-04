const expect = require("chai").expect;
const findAPIByType = require('../index').findAPIByType;
const apiCall = require('../index').constructPostQuery;

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
