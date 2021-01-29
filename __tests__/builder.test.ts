import { BioThingsQueryBuilder } from '../src/query/builder';
import { ValidBioEntity } from '../src/bioentity';
import { APIMETA } from '../src/config';


describe("Test BioThingsQueryBuilder Class", () => {
    describe("Test getDBIDs function", () => {
        test("BioThings API Response are correctly parsed", () => {
            const response = [
                {
                    "query": "1017",
                    "entrezgene": "1017",
                    "symbol": "CDK2"
                },
                {
                    "query": "1019",
                    "entrezgene": "1019",
                    "symbol": "CDK4"
                }
            ]
            const builder = new BioThingsQueryBuilder("Gene", ["NCBIGene:1017", "NCBIGene:1018"]);
            const res = builder.getDBIDs("NCBIGene", "Gene", response);
            expect(res).toHaveProperty("NCBIGene:1017");
            expect(res).toHaveProperty("NCBIGene:1019");
            expect(res["NCBIGene:1017"]).toBeInstanceOf(ValidBioEntity);
            const entity = res["NCBIGene:1017"];
            expect(entity.primaryID).toEqual("NCBIGene:1017");
        })

        test("failed record should be skipped", () => {
            const response = [
                {
                    "query": "1017",
                    "entrezgene": "1017",
                    "symbol": "CDK2"
                },
                {
                    "query": "1019",
                    "notfound": true,
                    "entrezgene": "1019",
                    "symbol": "CDK4"
                }
            ]
            const builder = new BioThingsQueryBuilder("Gene", ["NCBIGene:1017", "NCBIGene:1018"]);
            const res = builder.getDBIDs("NCBIGene", "Gene", response);
            expect(res).toHaveProperty("NCBIGene:1017");
            expect(res).not.toHaveProperty("NCBIGene:1019");
        })
    })

    describe("test buildOneQuery function", () => {
        test("test with gene inputs", async () => {
            const builder = new BioThingsQueryBuilder("Gene", ["NCBIGene:1017", "NCBIGene:1018"]);
            const res = await builder.buildOneQuery(APIMETA.Gene, "NCBIGene", ["1017", "1018"]);
            expect(res).toHaveProperty("NCBIGene:1017")
        })
    })

    describe("test buildQueries function", () => {
        test("Inputs with less than 1000 ids should return one promise", async () => {
            const builder = new BioThingsQueryBuilder("Gene", ["NCBIGene:1017", "NCBIGene:1018"]);
            const res = builder.buildQueries(APIMETA.Gene, "NCBIGene", ["1017", "1018"]);
            expect(res).toHaveLength(1);
            expect(res[0]).toBeInstanceOf(Promise)
        })

        test("Inputs with more than 1000 ids should return more than one promise", async () => {
            const fakeInputs = [...Array(1990).keys()].map(item => 'NCBIGene:' + item.toString());
            const builder = new BioThingsQueryBuilder("Gene", fakeInputs);
            const res = builder.buildQueries(APIMETA.Gene, "NCBIGene", fakeInputs);
            expect(res).toHaveLength(2);
        })
    })

    describe("test build function", () => {
        test("Inputs with a mix of ids with different prefixes", async () => {
            const builder = new BioThingsQueryBuilder("Gene", ["NCBIGene:1017", "OMIM:1018"]);
            const res = builder.build();
            expect(res).toHaveLength(2);
            expect(res[0]).toBeInstanceOf(Promise)
        })

        test("Inputs with more than 1000 ids should return more than one promise", async () => {
            const fakeNCBIGeneInputs = [...Array(1990).keys()].map(item => 'NCBIGene:' + item.toString());
            const fakeOMIMGeneInputs = [...Array(2300).keys()].map(item => "OMIM:" + item.toString());
            const builder = new BioThingsQueryBuilder("Gene", [...fakeNCBIGeneInputs, ...fakeOMIMGeneInputs]);
            const res = builder.build();
            expect(res).toHaveLength(5);
        })
    })
})