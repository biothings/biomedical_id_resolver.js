import DefaultIDResolver from '../../src/resolve/default_resolver';
import { ResolvableBioEntity } from '../../src/bioentity/valid_bioentity';
import { IrresolvableBioEntity } from '../../src/bioentity/irresolvable_bioentity';

jest.setTimeout(30000)
describe("Test ID Resolver", () => {
    test("Test valid inputs should be corretly resolved", async () => {
        const resolver = new DefaultIDResolver();
        const res = await resolver.resolve({ "Gene": ["NCBIGene:1017"] });
        expect(res).toHaveProperty("NCBIGene:1017");
        expect(res['NCBIGene:1017'].Gene).toBeInstanceOf(ResolvableBioEntity);
        expect(res['NCBIGene:1017'].Gene.primaryID).toEqual("NCBIGene:1017");
        expect(res['NCBIGene:1017'].Gene.label).toEqual("CDK2")
    })

    test("Test BioThings output include integer should be converted to string", async () => {
        const resolver = new DefaultIDResolver();
        const res = await resolver.resolve({ "ChemicalSubstance": ["CHEMBL.COMPOUND:CHEMBL744"] });
        expect(res['CHEMBL.COMPOUND:CHEMBL744'].ChemicalSubstance).toBeInstanceOf(ResolvableBioEntity);
        expect(res['CHEMBL.COMPOUND:CHEMBL744'].ChemicalSubstance.dbIDs).toHaveProperty("PUBCHEM", ["5070"]);
    })

    test("Test valid inputs from multiple semantic types should be corretly resolved", async () => {
        const resolver = new DefaultIDResolver();
        const res = await resolver.resolve({ "Gene": ["NCBIGene:1017"], "ChemicalSubstance": ["DRUGBANK:DB01609"] });
        expect(res).toHaveProperty("NCBIGene:1017");
        expect(res['NCBIGene:1017'].Gene).toBeInstanceOf(ResolvableBioEntity);
        expect(res['NCBIGene:1017'].Gene.primaryID).toEqual("NCBIGene:1017");
        expect(res['NCBIGene:1017'].Gene.label).toEqual("CDK2");
        expect(res).toHaveProperty("DRUGBANK:DB01609");
        expect(res['DRUGBANK:DB01609'].ChemicalSubstance).toBeInstanceOf(ResolvableBioEntity);
        expect(res['DRUGBANK:DB01609'].ChemicalSubstance.label.toUpperCase()).toEqual("DEFERASIROX");
    })

    test("Test Irresolvable inputs should be part of the result", async () => {
        const resolver = new DefaultIDResolver();
        const res = await resolver.resolve({ "Gene": ["NCBIGene:1017", "kkk:123"] });
        expect(res).toHaveProperty("kkk:123");
        expect(res['kkk:123'].Gene).toBeInstanceOf(IrresolvableBioEntity);
        expect(res['kkk:123'].Gene.primaryID).toEqual('kkk:123');
        expect(res['kkk:123'].Gene.label).toEqual('kkk:123')
    })

    test("test large batch of inputs should be correctly resolved", async () => {
        const fakeNCBIGeneInputs = [...Array(1990).keys()].map(item => 'NCBIGene:' + item.toString());
        const fakeOMIMGeneInputs = [...Array(2300).keys()].map(item => "OMIM:" + item.toString());
        const fakeDrugbankInputs = [...Array(3500).keys()].map(item => "DRUGBANK:DB00" + item.toString());
        const resolver = new DefaultIDResolver();
        const res = await resolver.resolve({
            Gene: [...fakeNCBIGeneInputs, ...fakeOMIMGeneInputs],
            ChemicalSubstance: fakeDrugbankInputs
        })
        expect(Object.keys(res)).toHaveLength(fakeDrugbankInputs.length + fakeNCBIGeneInputs.length + fakeOMIMGeneInputs.length);
        expect(res['OMIM:0'].Gene).toBeInstanceOf(IrresolvableBioEntity)

    })

    test("Test inputs with undefined semanticType should be corretly resolved", async () => {
        const resolver = new DefaultIDResolver();
        const res = await resolver.resolve({ "undefined": ["NCBIGene:1017"] });
        expect(res).toHaveProperty("NCBIGene:1017");
        expect(res['NCBIGene:1017'].Gene).toBeInstanceOf(ResolvableBioEntity);
        expect(res['NCBIGene:1017'].Gene.primaryID).toEqual("NCBIGene:1017");
        expect(res['NCBIGene:1017'].Gene.label).toEqual("CDK2");
        expect(res['NCBIGene:1017'].Gene.semanticType).toEqual("Gene");
    })

    test("Test inputs with undefined semanticType and could be mapped to multiple semantictypes should be corretly resolved", async () => {
        const resolver = new DefaultIDResolver();
        const res = await resolver.resolve({ "undefined": ["UMLS:C0008780"] });
        expect(res).toHaveProperty("UMLS:C0008780");
        expect(res['UMLS:C0008780'].Disease).toBeInstanceOf(ResolvableBioEntity);
        expect(res['UMLS:C0008780'].Disease.primaryID).toEqual("MONDO:0016575");
        expect(res['UMLS:C0008780'].Disease.label).toEqual("primary ciliary dyskinesia");
        expect(res['UMLS:C0008780'].Disease.semanticType).toEqual("Disease");
    })

    test("Test inputs with undefined semanticType and could be mapped to multiple semantictypes using OMIM ID as example should be corretly resolved", async () => {
        const resolver = new DefaultIDResolver();
        const res = await resolver.resolve({ "undefined": ["OMIM:116953"] });
        expect(res).toHaveProperty("OMIM:116953");
        expect(res['OMIM:116953'].Gene).toBeInstanceOf(ResolvableBioEntity);
        expect(res['OMIM:116953'].Gene.primaryID).toEqual("NCBIGene:1017");
        expect(res['OMIM:116953'].Gene.label).toEqual("CDK2");
        expect(res['OMIM:116953'].Gene.semanticType).toEqual("Gene");
    })

    test("Test inputs with undefined semanticType and could not be mapped to any semantic type should return Irresolvable", async () => {
        const resolver = new DefaultIDResolver();
        const res = await resolver.resolve({ "undefined": ["OMIM1:116953"] });
        expect(res).toHaveProperty("OMIM1:116953");
        expect(res['OMIM1:116953']["undefined"]).toBeInstanceOf(IrresolvableBioEntity);
        expect(res['OMIM1:116953']["undefined"].semanticType).toEqual("undefined");
    })

    test("Test Irresolvable inputs should not overwrite the result of a valid input", async () => {
        const resolver = new DefaultIDResolver();
        const res = await resolver.resolve({ "Gene": ["NCBIGene:1017"], "Disease": ["NCBIGene:1017"] });
        expect(res).toHaveProperty("NCBIGene:1017");
        expect(res['NCBIGene:1017'].Gene).toBeInstanceOf(ResolvableBioEntity);
        expect(res['NCBIGene:1017'].Gene.primaryID).toEqual("NCBIGene:1017");
        expect(res['NCBIGene:1017'].Gene.label).toEqual("CDK2");
        expect(res['NCBIGene:1017'].Disease).toBeInstanceOf(IrresolvableBioEntity);
    })
})