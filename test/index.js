const expect = require("chai").expect;
const findAPIByType = require('../index').findAPIByType;

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
