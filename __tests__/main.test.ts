import IDResolver from '../src/index';
import { BioEntity, InValidBioEntity } from '../src/bioentity'

jest.setTimeout(30000)
describe("Test ID Resolver", () => {
    test("Test valid inputs should be corretly resolved", async () => {
        const resolver = new IDResolver();
        const res = await resolver.resolve({ "Gene": ["NCBIGene:1017"] });
        expect(res).toHaveProperty("NCBIGene:1017");
        expect(res['NCBIGene:1017']).toBeInstanceOf(BioEntity);
        expect(res['NCBIGene:1017'].getPrimaryID()).toEqual("NCBIGene:1017");
        expect(res['NCBIGene:1017'].getLabel()).toEqual("CDK2")
    })

    test("Test valid inputs from multiple semantic types should be corretly resolved", async () => {
        const resolver = new IDResolver();
        const res = await resolver.resolve({ "Gene": ["NCBIGene:1017"], "ChemicalSubstance": ["DRUGBANK:DB01609"] });
        expect(res).toHaveProperty("NCBIGene:1017");
        expect(res['NCBIGene:1017']).toBeInstanceOf(BioEntity);
        expect(res['NCBIGene:1017'].getPrimaryID()).toEqual("NCBIGene:1017");
        expect(res['NCBIGene:1017'].getLabel()).toEqual("CDK2");
        expect(res).toHaveProperty("DRUGBANK:DB01609");
        expect(res['DRUGBANK:DB01609']).toBeInstanceOf(BioEntity);
        expect(res['DRUGBANK:DB01609'].getLabel().toUpperCase()).toEqual("DEFERASIROX");
    })

    test("Test invalid inputs should be part of the result", async () => {
        const resolver = new IDResolver();
        const res = await resolver.resolve({ "Gene": ["NCBIGene:1017", "kkk:123"] });
        expect(res).toHaveProperty("kkk:123");
        expect(res['kkk:123']).toBeInstanceOf(InValidBioEntity);
        expect(res['kkk:123'].getPrimaryID()).toEqual('kkk:123');
        expect(res['kkk:123'].getLabel()).toEqual('kkk:123')
    })

    test("test large batch of inputs should be correctly resolved", async () => {
        const fakeNCBIGeneInputs = [...Array(1990).keys()].map(item => 'NCBIGene:' + item.toString());
        const fakeOMIMGeneInputs = [...Array(2300).keys()].map(item => "OMIM:" + item.toString());
        const fakeDrugbankInputs = [...Array(3500).keys()].map(item => "DRUGBANK:DB00" + item.toString());
        const resolver = new IDResolver();
        const res = await resolver.resolve({
            Gene: [...fakeNCBIGeneInputs, ...fakeOMIMGeneInputs],
            ChemicalSubstance: fakeDrugbankInputs
        })
        expect(Object.keys(res)).toHaveLength(fakeDrugbankInputs.length + fakeNCBIGeneInputs.length + fakeOMIMGeneInputs.length);
        expect(res['OMIM:0']).toBeInstanceOf(InValidBioEntity)

    })
})