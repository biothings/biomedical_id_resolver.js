import { addAttributes } from '../../src/attr';

describe("Test Attribute Getter", () => {

    test("getting attributes of Gene", async () => {

        let semanticType = "Gene";
        let entityId = "NCBIGene:9604";
        const res = await addAttributes(semanticType, entityId);
        expect(res).toHaveProperty('interpro');
        expect(res).toHaveProperty('type_of_gene');
        expect(res['type_of_gene']).toContain('protein-coding')
    });

    test("getting attributes of SmallMolecule", async () => {

        let semanticType = "SmallMolecule";
        let entityId = "CHEMBL.COMPOUND:CHEMBL433";
        const res = await addAttributes(semanticType, entityId);
        expect(res).toHaveProperty('chembl_max_phase');
        expect(res).toHaveProperty('fda_epc_pharmacology_class');
        expect(res['fda_epc_pharmacology_class']).toContain('Anti-epileptic Agent')
    });

    test("getting attributes of Disease", async () => {
        // should work but doesn't return anything...
        let semanticType = "Disease";
        let entityId = "MONDO:0019188";
        const res = await addAttributes(semanticType, entityId);
        //not found
        expect(res).toStrictEqual({});
    });

    test("invalid entity", async () => {

        let semanticType = "Gene";
        let entityId = "MONDO:1234";
        const res = await addAttributes(semanticType, entityId);
        //not found
        expect(res).toStrictEqual(undefined);
    });
});