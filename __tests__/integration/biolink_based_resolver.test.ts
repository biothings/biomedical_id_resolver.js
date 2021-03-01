import BioLinkBasedResolver from '../../src/resolve/biolink_based_resolver';
import { ResolvableBioEntity } from '../../src/bioentity/valid_bioentity';
import { IrresolvableBioEntity } from '../../src/bioentity/irresolvable_bioentity';

jest.setTimeout(30000)
describe("Test ID Resolver", () => {
    test("Test valid inputs should be corretly resolved", async () => {
        const resolver = new BioLinkBasedResolver();
        const res = await resolver.resolve({ "Gene": ["NCBIGENE:1017"] });
        expect(res).toHaveProperty("NCBIGENE:1017");
        expect(res['NCBIGENE:1017']).toHaveLength(1);
        expect(res['NCBIGENE:1017'][0]).toBeInstanceOf(ResolvableBioEntity);
        expect(res['NCBIGENE:1017'][0].primaryID).toEqual("NCBIGENE:1017");
        expect(res['NCBIGENE:1017'][0].label).toEqual("CDK2")
    })

    test("Test BioThings output include integer should be converted to string", async () => {
        const resolver = new BioLinkBasedResolver();
        const res = await resolver.resolve({ "ChemicalSubstance": ["CHEMBL.COMPOUND:CHEMBL744"] });
        expect(res['CHEMBL.COMPOUND:CHEMBL744'][0]).toBeInstanceOf(ResolvableBioEntity);
        expect(res['CHEMBL.COMPOUND:CHEMBL744'][0].dbIDs["PUBCHEM.COMPOUND"]).toEqual(["5070"]);
    })

    test("Test valid inputs from multiple semantic types should be corretly resolved", async () => {
        const resolver = new BioLinkBasedResolver();
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
        const resolver = new BioLinkBasedResolver();
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
        const resolver = new BioLinkBasedResolver();
        const res = await resolver.resolve({
            Gene: [...fakeNCBIGENEInputs, ...fakeOMIMGeneInputs],
            ChemicalSubstance: fakeDrugbankInputs
        })
        expect(Object.keys(res)).toHaveLength(fakeDrugbankInputs.length + fakeNCBIGENEInputs.length + fakeOMIMGeneInputs.length);
        expect(res['OMIM:0'][0]).toBeInstanceOf(IrresolvableBioEntity)

    })

    test("Test inputs with NamedThing semanticType should be corretly resolved", async () => {
        const resolver = new BioLinkBasedResolver();
        const res = await resolver.resolve({ "NamedThing": ["NCBIGENE:1017"] });
        expect(res).toHaveProperty("NCBIGENE:1017");
        expect(res["NCBIGENE:1017"]).toHaveLength(2);
        expect(res['NCBIGENE:1017'][0]).toBeInstanceOf(ResolvableBioEntity);
        expect(res['NCBIGENE:1017'][0].primaryID).toEqual("NCBIGENE:1017");
        expect(res['NCBIGENE:1017'][0].label).toEqual("CDK2");
        expect(res['NCBIGENE:1017'][0].semanticType).toEqual("Gene");
        expect(res["NCBIGENE:1017"][0].semanticTypes).toContain("NamedThing");
    })

    test("Test inputs with NamedThing semanticType and could be mapped to multiple semantictypes should be corretly resolved", async () => {
        const resolver = new BioLinkBasedResolver();
        const res = await resolver.resolve({ "NamedThing": ["UMLS:C0008780"] });
        expect(res).toHaveProperty("UMLS:C0008780");
        const valid = res["UMLS:C0008780"].filter(rec => rec instanceof ResolvableBioEntity);
        const validTypes = valid.map(item => item.semanticType);
        expect(validTypes).toContain("PhenotypicFeature");
        expect(validTypes).toContain("Disease");
        expect(valid).toHaveLength(2);
        expect(valid[0].semanticTypes).toContain("NamedThing");
    })

    test("Test inputs with NamedThing semanticType and could be mapped to multiple semantictypes using OMIM ID as example should be corretly resolved", async () => {
        const resolver = new BioLinkBasedResolver();
        const res = await resolver.resolve({ "NamedThing": ["OMIM:116953"] });
        expect(res).toHaveProperty("OMIM:116953");
        const valid = res["OMIM:116953"].filter(item => item instanceof ResolvableBioEntity);
        expect(valid).toHaveLength(1);
        expect(valid[0]).toBeInstanceOf(ResolvableBioEntity);
        expect(valid[0].primaryID).toEqual("NCBIGENE:1017");
        expect(valid[0].label).toEqual("CDK2");
        expect(valid[0].semanticType).toEqual("Gene");
        expect(valid[0].semanticTypes).toContain("NamedThing");
        expect(valid[0].semanticTypes).toContain("BiologicalEntity");
    })

    test("Test inputs with undefined semanticType and could not be mapped to any semantic type should return Irresolvable", async () => {
        const resolver = new BioLinkBasedResolver();
        const res = await resolver.resolve({ "undefined": ["OMIM1:116953"] });
        expect(res).toHaveProperty("OMIM1:116953");
        expect(res['OMIM1:116953'][0]).toBeInstanceOf(IrresolvableBioEntity);
        expect(res['OMIM1:116953'][0].semanticType).toEqual("undefined");
    })

    test("Test Irresolvable inputs should not overwrite the result of a valid input", async () => {
        const resolver = new BioLinkBasedResolver();
        const res = await resolver.resolve({ "Gene": ["NCBIGENE:1017"], "Disease": ["NCBIGENE:1017"] });
        expect(res).toHaveProperty("NCBIGENE:1017");
        expect(res["NCBIGENE:1017"]).toHaveLength(2);
        expect(res['NCBIGENE:1017'][0]).toBeInstanceOf(ResolvableBioEntity);
        expect(res['NCBIGENE:1017'][0].primaryID).toEqual("NCBIGENE:1017");
        expect(res['NCBIGENE:1017'][0].label).toEqual("CDK2");
        expect(res['NCBIGENE:1017'][1]).toBeInstanceOf(IrresolvableBioEntity);
    })
})