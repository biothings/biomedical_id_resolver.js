const expect = require("chai").expect;
const helper = require('../helper');

describe("Test helper functions", function() {
    describe("Test group IDs by prefix helper", function() {
        it("if input is not an array, return empty object", function() {
            let _input = 1017;
            let res = helper.groupIdByPrefix(_input);
            expect(res).to.be.an('object').that.is.empty;
            _input = undefined;
            res = helper.groupIdByPrefix(_input);
            expect(res).to.be.an('object').that.is.empty;
            _input = '1017';
            res = helper.groupIdByPrefix(_input);
            expect(res).to.be.an('object').that.is.empty;
            _input = {'1017': '1018'};
            res = helper.groupIdByPrefix(_input);
            expect(res).to.be.an('object').that.is.empty;
            _input = ['entrez:1017', 'entrez:1018'];
            res = helper.groupIdByPrefix(_input);
            expect(res).to.be.an('object').that.is.not.empty;
        });
        it("if one of the input is a number, add to invalid category", function() {
            _input = ['entrez:1017', 1018];
            res = helper.groupIdByPrefix(_input);
            expect(res['invalid']).to.be.a('set').that.includes('1018');
            expect(res['invalid']).to.be.a('set').that.does.not.includes('entrez:1017');
        });
        it("if one of the input is neither a number nor a string, it should be excluded", function() {
            _input = ['entrez:1017', ['kevin']];
            res = helper.groupIdByPrefix(_input);
            expect(res).to.be.an('object').to.not.have.any.keys('invalid');
        });
        it("IDs grouped based on prefix", function() {
            let _input = ['entrez:1017', 'entrez:1018', 'hgnc:1778', 'symbol:CDK7'];
            let res = helper.groupIdByPrefix(_input);
            expect(res).to.have.all.keys('entrez', 'hgnc', 'symbol', 'mapping');
            expect(res).to.deep.equal({'entrez': new Set(['1017', '1018']), 'hgnc': new Set(['1778']), 'symbol': new Set(['CDK7']), 'mapping': {'entrez:1017': 'entrez:1017', 'entrez:1018': 'entrez:1018', 'hgnc:1778': 'hgnc:1778', 'symbol:CDK7': 'symbol:CDK7'}});
        });
        it("For IDs naturally prefixed, the prefix should be kept in the value", function() {
            let _input = ['GO:0000123', 'HP:1234', 'entrez:1018', 'GO:GO:00123'];
            let res = helper.groupIdByPrefix(_input);
            expect(res).to.deep.equal({'go': new Set(['GO:0000123', 'GO:00123']),
                                       'hp': new Set(['HP:1234']), 
                                       'entrez': new Set(['1018']),
                                       'mapping': {
                                           "go:GO:0000123": "GO:0000123",
                                           "hp:HP:1234": "HP:1234",
                                           "entrez:1018": "entrez:1018",
                                           "go:GO:00123": "GO:GO:00123"
                                       }})
        });
        it("non-string value of the input will be skipped", function() {
            let _input = [undefined];
            let res = helper.groupIdByPrefix(_input);
            expect(res).to.be.an('object').that.is.empty;
        });
    })
    describe("Test extract scope function", function() {
        it('if matched, return the scope', function(){
            let url = 'q=1017&scopes=entrezgene&fields=name,symbol,entrezgene,MIM,HGNC,umls.cui&dotfield=true';
            expect(helper.extractScopeFromUrl(url)).to.equal('entrezgene');
        })
        it('if unmatched, return undefined', function(){
            let url = 'q=1017&scope=entrezgene&fields=name,symbol,entrezgene,MIM,HGNC,umls.cui&dotfield=true';
            expect(helper.extractScopeFromUrl(url)).undefined;
            url = 'q=1017&scopes=entrezgene';
            expect(helper.extractScopeFromUrl(url)).undefined;
        })
    })
})
