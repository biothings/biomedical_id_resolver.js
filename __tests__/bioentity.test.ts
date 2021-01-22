import { BioEntity } from '../src/bioentity';

const CDK2_DB_IDs = {
    "NCBIGene": ["1017"],
    "HGNC": ["1771"],
    "SYMBOL": ["CDK2"],
    "name": ["cyclin dependent kinase 2"],
}

const RILUZOLE_DB_IDS = {
    "CHEMBL.COMPOUND": ["CHEMBL744"],
    "name": ["Riluzole", "RILUZOLE"],
    "PUBCHEM": ["5070"],
}

const DB_ID_WITH_NO_PRIMARY = {
    kk: ["kkk"]
}

const CHEMBL7512_DB_IDS = { "CHEMBL.COMPOUND": ["CHEMBL7512"], "PUBCHEM": ["53428"] }
describe("Test BioEntity Class", () => {
    describe("Test getPrimaryID function", () => {
        test("db ids with prefixes defined in metadata should return the primary id", () => {
            const entity = new BioEntity("Gene", CDK2_DB_IDs);
            const primary_id = entity.getPrimaryID();
            expect(primary_id).toBe("NCBIGene:1017")
        })

        test("db ids without prefixes defined in metadata should return undefined", () => {
            const entity = new BioEntity("Gene", DB_ID_WITH_NO_PRIMARY);
            const primary_id = entity.getPrimaryID();
            expect(primary_id).toBeUndefined();
        })
    })

    describe("Test getLabel function", () => {
        test("if SYMBOL provided in db ids, should return symbol", () => {
            const entity = new BioEntity("Gene", CDK2_DB_IDs);
            const label = entity.getLabel();
            expect(label).toBe("CDK2");
        })

        test("if SYMBOL not provided in db ids and name is provided, should return name", () => {
            const entity = new BioEntity("ChemicalSubstance", RILUZOLE_DB_IDS);
            const label = entity.getLabel();
            expect(label).toBe("Riluzole");
        })

        test("if both SYMBOL and name are not provided in db ids, should return primary id", () => {
            const entity = new BioEntity("ChemicalSubstance", CHEMBL7512_DB_IDS);
            const label = entity.getLabel();
            expect(label).toBe("CHEMBL.COMPOUND:CHEMBL7512");
        })
    });

    describe("Test getCuries function", () => {
        test("test getCuries", () => {
            const entity = new BioEntity("ChemicalSubstance", CHEMBL7512_DB_IDS);
            const curies = entity.getCuries();
            expect(curies).toContain("CHEMBL.COMPOUND:CHEMBL7512");
            expect(curies).toHaveLength(2);
        })

    })

})