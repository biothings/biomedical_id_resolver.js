const dispatch = require("../src/dispatch");
const { expect } = require("chai");

describe("Test dispatch functions", () => {
    describe("Test findAPIByType function", () => {
        let dp = new dispatch([]);
        let res = dp.findAPIByType('Gene', 'NCBIGene');
        expect(res).to.equal()
    })
})
