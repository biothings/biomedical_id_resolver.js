import DefaultIDResolver from '../../src/resolve/default_resolver';
import { ResolvableBioEntity } from '../../src/bioentity/valid_bioentity';
import { IrresolvableBioEntity } from '../../src/bioentity/irresolvable_bioentity';

jest.setTimeout(30000)
describe("Test ID Resolver", () => {
    test("Test valid inputs should be corretly resolved", async () => {
        const resolver = new DefaultIDResolver();
        const res = await resolver.resolve({ "Gene": ["NCBIGENE:1017"] });
        expect(res).toHaveProperty("NCBIGENE:1017");
        expect(res['NCBIGENE:1017']).toHaveLength(1);
        expect(res['NCBIGENE:1017'][0]).toBeInstanceOf(ResolvableBioEntity);
        expect(res['NCBIGENE:1017'][0].primaryID).toEqual("NCBIGENE:1017");
        expect(res['NCBIGENE:1017'][0].label).toEqual("CDK2")
    })

    test("Test symbol should be resolved to corresponding human gene", async () => {
        const resolver = new DefaultIDResolver();
        const res = await resolver.resolve({ "Gene": ["SYMBOL:VAMP2"] });
        expect(res).toHaveProperty("SYMBOL:VAMP2");
        expect(res['SYMBOL:VAMP2']).toHaveLength(1);
        expect(res['SYMBOL:VAMP2'][0]).toBeInstanceOf(ResolvableBioEntity);
        expect(res['SYMBOL:VAMP2'][0].primaryID).toEqual("NCBIGENE:6844");
        expect(res['SYMBOL:VAMP2'][0].label).toEqual("VAMP2")
    })

    test("records from a query with multiple hits should all be collected", async () => {
        const resolver = new DefaultIDResolver();
        const res = await resolver.resolve({ "Disease": ["OMIM:307030"] });
        expect(res).toHaveProperty("OMIM:307030");
        expect(res['OMIM:307030']).toHaveLength(1);
        expect(res['OMIM:307030'][0]).toBeInstanceOf(ResolvableBioEntity);
        expect(res['OMIM:307030'][0].primaryID).toEqual("MONDO:0010613");
        expect(res['OMIM:307030'][0].dbIDs.UMLS).toContain("C0268418");
        expect(res['OMIM:307030'][0].dbIDs.UMLS).toContain("C0574108");
    })

    test("Test valid inputs should be corretly resolved using Disease GARD ID", async () => {
        const resolver = new DefaultIDResolver();
        const res = await resolver.resolve({ "Disease": ["GARD:4206"] });
        expect(res).toHaveProperty("GARD:4206");
        expect(res['GARD:4206']).toHaveLength(1);
        expect(res['GARD:4206'][0]).toBeInstanceOf(ResolvableBioEntity);
        expect(res['GARD:4206'][0].primaryID).toEqual("MONDO:0015278");
    })

    test("Test BioThings output include integer should be converted to string", async () => {
        const resolver = new DefaultIDResolver();
        const res = await resolver.resolve({ "ChemicalSubstance": ["CHEMBL.COMPOUND:CHEMBL744"] });
        expect(res['CHEMBL.COMPOUND:CHEMBL744'][0]).toBeInstanceOf(ResolvableBioEntity);
        expect(res['CHEMBL.COMPOUND:CHEMBL744'][0].dbIDs["PUBCHEM.COMPOUND"]).toEqual(["5070"]);
    })

    test("Test valid inputs from multiple semantic types should be corretly resolved", async () => {
        const resolver = new DefaultIDResolver();
        const res = await resolver.resolve({ "Gene": ["NCBIGENE:1017"], "ChemicalSubstance": ["DRUGBANK:DB01609"] });
        expect(res).toHaveProperty("NCBIGENE:1017");
        expect(res['NCBIGENE:1017']).toHaveLength(1);
        expect(res['NCBIGENE:1017'][0]).toBeInstanceOf(ResolvableBioEntity);
        expect(res['NCBIGENE:1017'][0].primaryID).toEqual("NCBIGENE:1017");
        expect(res['NCBIGENE:1017'][0].label).toEqual("CDK2");
        expect(res).toHaveProperty("DRUGBANK:DB01609");
        expect(res["DRUGBANK:DB01609"]).toHaveLength(1);
        expect(res['DRUGBANK:DB01609'][0]).toBeInstanceOf(ResolvableBioEntity);
        expect(res['DRUGBANK:DB01609'][0].label.toUpperCase()).toEqual("DEFERASIROX");
    })

    test("Test Irresolvable inputs should be part of the result", async () => {
        const resolver = new DefaultIDResolver();
        const res = await resolver.resolve({ "Gene": ["NCBIGENE:1017", "kkk:123"] });
        expect(res).toHaveProperty("kkk:123");
        expect(res['kkk:123']).toHaveLength(1);
        expect(res['kkk:123'][0]).toBeInstanceOf(IrresolvableBioEntity);
        expect(res['kkk:123'][0].primaryID).toEqual('kkk:123');
        expect(res['kkk:123'][0].label).toEqual('kkk:123')
    })

    test("test large batch of inputs should be correctly resolved", async () => {
        const fakeNCBIGENEInputs = [...Array(1990).keys()].map(item => 'NCBIGENE:' + item.toString());
        const fakeOMIMGeneInputs = [...Array(2300).keys()].map(item => "OMIM:" + item.toString());
        const fakeDrugbankInputs = [...Array(3500).keys()].map(item => "DRUGBANK:DB00" + item.toString());
        const resolver = new DefaultIDResolver();
        const res = await resolver.resolve({
            Gene: [...fakeNCBIGENEInputs, ...fakeOMIMGeneInputs],
            ChemicalSubstance: fakeDrugbankInputs
        })
        expect(Object.keys(res)).toHaveLength(fakeDrugbankInputs.length + fakeNCBIGENEInputs.length + fakeOMIMGeneInputs.length);
        expect(res['OMIM:0'][0]).toBeInstanceOf(IrresolvableBioEntity)

    })

    test("Test inputs with undefined semanticType should be corretly resolved", async () => {
        const resolver = new DefaultIDResolver();
        const res = await resolver.resolve({ "undefined": ["NCBIGENE:1017"] });
        expect(res).toHaveProperty("NCBIGENE:1017");
        expect(res['NCBIGENE:1017'][0]).toBeInstanceOf(ResolvableBioEntity);
        expect(res['NCBIGENE:1017'][0].primaryID).toEqual("NCBIGENE:1017");
        expect(res['NCBIGENE:1017'][0].label).toEqual("CDK2");
        expect(res['NCBIGENE:1017'][0].semanticType).toEqual("Gene");
    })

    test("Test inputs with undefined semanticType and could be mapped to multiple semantictypes should be corretly resolved", async () => {
        const resolver = new DefaultIDResolver();
        const res = await resolver.resolve({ "undefined": ["UMLS:C0008780"] });
        expect(res).toHaveProperty("UMLS:C0008780");
        const valid = res["UMLS:C0008780"].filter(rec => rec instanceof ResolvableBioEntity);
        expect(valid).toHaveLength(2);
        expect(valid[0].semanticType).toEqual("PhenotypicFeature");
        expect(valid[1].primaryID).toEqual("MONDO:0016575");
        expect(valid[1].label).toEqual("primary ciliary dyskinesia");
        expect(valid[1].semanticType).toEqual("Disease");
    })

    test("Test inputs with undefined semanticType and could be mapped to multiple semantictypes using OMIM ID as example should be corretly resolved", async () => {
        const resolver = new DefaultIDResolver();
        const res = await resolver.resolve({ "undefined": ["OMIM:116953"] });
        expect(res).toHaveProperty("OMIM:116953");
        expect(res['OMIM:116953'][0]).toBeInstanceOf(ResolvableBioEntity);
        expect(res['OMIM:116953'][0].primaryID).toEqual("NCBIGENE:1017");
        expect(res['OMIM:116953'][0].label).toEqual("CDK2");
        expect(res['OMIM:116953'][0].semanticType).toEqual("Gene");
    })

    test("Test inputs with undefined semanticType and could not be mapped to any semantic type should return Irresolvable", async () => {
        const resolver = new DefaultIDResolver();
        const res = await resolver.resolve({ "undefined": ["OMIM1:116953"] });
        expect(res).toHaveProperty("OMIM1:116953");
        expect(res['OMIM1:116953'][0]).toBeInstanceOf(IrresolvableBioEntity);
        expect(res['OMIM1:116953'][0].semanticType).toEqual("undefined");
    })

    test("Test Irresolvable inputs should not overwrite the result of a valid input", async () => {
        const resolver = new DefaultIDResolver();
        const res = await resolver.resolve({ "Gene": ["NCBIGENE:1017"], "Disease": ["NCBIGENE:1017"] });
        expect(res).toHaveProperty("NCBIGENE:1017");
        expect(res["NCBIGENE:1017"]).toHaveLength(2);
        expect(res['NCBIGENE:1017'][0]).toBeInstanceOf(ResolvableBioEntity);
        expect(res['NCBIGENE:1017'][0].primaryID).toEqual("NCBIGENE:1017");
        expect(res['NCBIGENE:1017'][0].label).toEqual("CDK2");
        expect(res['NCBIGENE:1017'][1]).toBeInstanceOf(IrresolvableBioEntity);
    })
})