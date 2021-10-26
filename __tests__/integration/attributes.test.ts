import { getAttributes } from '../../src/index';


describe("Test Attribute Getter", () => {
    
    test("getting attributes batch", async () => {

        let ids = {
        "Gene":["UMLS:C1366500","UMLS:C0812258","UMLS:C1421286","UniProtKB:P24385","NCBIGene:23221"],
        "SmallMolecule":["PUBCHEM.COMPOUND:6230","PUBCHEM.COMPOUND:18142","PUBCHEM.COMPOUND:6231",
        "PUBCHEM.COMPOUND:6279","PUBCHEM.COMPOUND:9051","PUBCHEM.COMPOUND:11683",
        "PUBCHEM.COMPOUND:6917715","PUBCHEM.COMPOUND:40973","PUBCHEM.COMPOUND:68873",
        "PUBCHEM.COMPOUND:28417","PUBCHEM.COMPOUND:6540478","PUBCHEM.COMPOUND:13109",
        "PUBCHEM.COMPOUND:6238","PUBCHEM.COMPOUND:9568628","PUBCHEM.COMPOUND:9270",
        "PUBCHEM.COMPOUND:68861","PUBCHEM.COMPOUND:5994","PUBCHEM.COMPOUND:5281004",
        "PUBCHEM.COMPOUND:121248172","PUBCHEM.COMPOUND:130904","PUBCHEM.COMPOUND:119086",
        "PUBCHEM.COMPOUND:55245","PUBCHEM.COMPOUND:4369524","PUBCHEM.COMPOUND:10631",
        "PUBCHEM.COMPOUND:36709","PUBCHEM.COMPOUND:444036","PUBCHEM.COMPOUND:161597",
        "PUBCHEM.COMPOUND:4591","PUBCHEM.COMPOUND:5382","PUBCHEM.COMPOUND:1645",
        "PUBCHEM.COMPOUND:126941","PUBCHEM.COMPOUND:31703","PUBCHEM.COMPOUND:89594",
        "PUBCHEM.COMPOUND:15625","PUBCHEM.COMPOUND:2733526","PUBCHEM.COMPOUND:5757",
        "PUBCHEM.COMPOUND:68926","PUBCHEM.COMPOUND:23973","PUBCHEM.COMPOUND:3036",
        "PUBCHEM.COMPOUND:23978","PUBCHEM.COMPOUND:47289","PUBCHEM.COMPOUND:5330286",
        "PUBCHEM.COMPOUND:24947","PUBCHEM.COMPOUND:442530","PUBCHEM.COMPOUND:4261",
        "PUBCHEM.COMPOUND:445154","PUBCHEM.COMPOUND:657237","PUBCHEM.COMPOUND:3736298",
        "PUBCHEM.COMPOUND:9554","PUBCHEM.COMPOUND:387447","PUBCHEM.COMPOUND:444008",
        "PUBCHEM.COMPOUND:5991","PUBCHEM.COMPOUND:5280961","PUBCHEM.COMPOUND:3496",
        "PUBCHEM.COMPOUND:444732","PUBCHEM.COMPOUND:232446","PUBCHEM.COMPOUND:5281576",
        "PUBCHEM.COMPOUND:6623","PUBCHEM.COMPOUND:4115","PUBCHEM.COMPOUND:3224",
        "PUBCHEM.COMPOUND:6626","PUBCHEM.COMPOUND:3121","PUBCHEM.COMPOUND:1530",
        "PUBCHEM.COMPOUND:2723949","PUBCHEM.COMPOUND:5694","PUBCHEM.COMPOUND:5564",
        "PUBCHEM.COMPOUND:33184","PUBCHEM.COMPOUND:18529","PUBCHEM.COMPOUND:3758",
        "PUBCHEM.COMPOUND:1983","PUBCHEM.COMPOUND:5743","PUBCHEM.COMPOUND:8029",
        "PUBCHEM.COMPOUND:5794","PUBCHEM.COMPOUND:5943","PUBCHEM.COMPOUND:5921"]} 
        const res = await getAttributes(ids);
        expect(res).toHaveProperty('NCBIGene:23221');
        expect(res).toHaveProperty('PUBCHEM.COMPOUND:3121');
        expect(res).toHaveProperty('PUBCHEM.COMPOUND:387447');
    });

});