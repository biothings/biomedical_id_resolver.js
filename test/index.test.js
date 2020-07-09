const resolve = require("../src/index");

describe("Test resolve functions", () => {
    test("Test using NCBIGene IDs as input", async () => {
        const input = {
            Gene: ["NCBIGene:1017", "NCBIGene:1018"]
        };
        let res = await resolve(input);
        expect(Object.keys(res)).toContain("NCBIGene:1017");
        expect(Object.keys(res["NCBIGene:1017"])).toContain("id");
        expect(Object.keys(res["NCBIGene:1017"])).toContain("ids");
        expect(Object.keys(res["NCBIGene:1017"])).toContain("bte_ids");
        expect(Object.keys(res["NCBIGene:1017"])).toContain("equivalent_identifiers");
        expect(Object.keys(res["NCBIGene:1017"])).toContain("type");
        expect(Object.keys(res["NCBIGene:1017"]).length).toBe(5);
        expect(Object.keys(res).length).toBe(2);
    });
    test("Test using mixed Gene ID as input", async () => {
        const input = {
            Gene: ["NCBIGene:1017", "HGNC:1177"]
        };
        let res = await resolve(input);
        expect(Object.keys(res)).toContain("HGNC:1177");
    });
    test("Test using UBERON IDs", async () => {
        const input = {
            AnatomicalEntity: ["UBERON:0007173", "UBERON:0006849"]
        };
        let res = await resolve(input);
        expect(Object.keys(res)).toContain("UBERON:0007173");
        expect(res["UBERON:0007173"].type).toBe("AnatomicalEntity");
    });
    test("Test IDs from mixed semantic types", async () => {
        const input = {
            Gene: ["NCBIGene:1017"],
            AnatomicalEntity: ["UBERON:0007173", "UBERON:0006849"]
        };
        let res = await resolve(input);
        expect(Object.keys(res).length).toBe(3);
        expect(Object.keys(res)).toContain("UBERON:0007173");
        expect(res["UBERON:0007173"].type).toBe("AnatomicalEntity");
        expect(Object.keys(res)).toContain("NCBIGene:1017");
        expect(res["NCBIGene:1017"].type).toBe("Gene");
    });
    test("Test invalid ids", async () => {
        const input = {
            Gene: ["NCBIGene:1017", "cc:133"],
            AnatomicalEntity: ["UBERON:0007173", "UBERON:0006849"]
        };
        let res = await resolve(input);
        expect(Object.keys(res).length).toBe(4);
        expect(Object.keys(res)).toContain("cc:133");
        expect(res["cc:133"].type).toBe("Gene");
        expect(res["cc:133"].flag).toBe("failed");
    });
    test("Test valid ids assigned to wrong semantic types", async () => {
        const input = {
            Disease: ["MONDO:0016575", "UMLS:C1520166"]
        };
        let res = await resolve(input);
        expect(Object.keys(res).length).toBe(2);
        expect(Object.keys(res)).toContain("UMLS:C1520166");
        expect(res["UMLS:C1520166"].type).toBe("Disease");
        expect(res["UMLS:C1520166"].flag).toBe("failed");
    });
    test("Test valid id but return 0 hits from biothings APIs", async () => {
        const input = {
            Disease: ["HP:0012418"],
            AnatomicalEntity: ["UBERON:0007173", "UBERON:0006849"]
        };
        let res = await resolve(input);
        expect(Object.keys(res).length).toBe(3);
        expect(Object.keys(res)).toContain("HP:0012418");
        expect(res["HP:0012418"].ids[0]).toBe("HP:0012418");
        expect(res["HP:0012418"].type).toBe("Disease");
        expect(res["HP:0012418"].flag).toBe("failed");
    });
})
