import { getAttributes } from '../../src/index';


describe("Test Attribute Getter", () => {
    
    test("getting attributes batch", async () => {

        let ids = {
            "Gene":["NCBIGene:23221"],
            "SmallMolecule":["PUBCHEM.COMPOUND:387447","PUBCHEM.COMPOUND:3121"]
        } ;
        const res = await getAttributes(ids);
        expect(res).toHaveProperty('NCBIGene:23221');
        expect(res).toHaveProperty('PUBCHEM.COMPOUND:3121');
        expect(res).toHaveProperty('PUBCHEM.COMPOUND:387447');
    });

});