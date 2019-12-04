const expect = require("chai").expect;
const helper = require('../helper');

describe("Test helper functions", function() {
    describe("Test group IDs by prefix helper", function() {
        it("if input is not a non-empty array, return empty object", function() {
            let _input = 'hello';
            let res = helper.groupIdByPrefix(_input);
            expect(res).to.be.an('object').that.is.empty;
            _input = [];
            res = helper.groupIdByPrefix(_input);
            expect(res).to.be.an('object').that.is.empty;
        });
        it("IDs grouped based on prefix", function() {
            let _input = ['entrez:1017', 'entrez:1018', 'hgnc:1778', 'symbol:CDK7'];
            let res = helper.groupIdByPrefix(_input);
            expect(res).to.have.all.keys('entrez', 'hgnc', 'symbol');
            expect(res).to.deep.equal({'entrez': new Set(['1017', '1018']), 'hgnc': new Set(['1778']), 'symbol': new Set(['CDK7'])});
        });
        it("For IDs naturally prefixed, the prefix should be kept in the value", function() {
            let _input = ['GO:0000123', 'HP:1234', 'entrez:1018', 'GO:GO:00123'];
            let res = helper.groupIdByPrefix(_input);
            expect(res).to.deep.equal({'go': new Set(['GO:0000123', 'GO:00123']), 'hp': new Set(['HP:1234']), 'entrez': new Set(['1018'])})
        });
        it("non-string value of the input will be skipped", function() {
            let _input = [undefined];
            let res = helper.groupIdByPrefix(_input);
            expect(res).to.be.an('object').that.is.empty;
        });
        it("input element which is not prefixed will be skipeed", function() {
            let _input = ['1234'];
            let res = helper.groupIdByPrefix(_input);
            expect(res).to.be.an('object').that.is.empty;
        })
    })
})
