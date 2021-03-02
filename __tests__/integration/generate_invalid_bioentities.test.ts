import generateInvalid from '../../src/fake';
import { IrresolvableBioEntity } from '../../src/bioentity/irresolvable_bioentity'

describe("Test generateInvalid function", () => {
    test("invalid inputs should be generated", () => {
        const input = {
            "Gene": ["NCBIGENE:1017", "NCBIGENE:1018"]
        }
        const res = generateInvalid(input);
        expect(res).toHaveProperty("NCBIGENE:1017");
        expect(res).toHaveProperty("NCBIGENE:1018");
        expect(res["NCBIGENE:1017"][0]).toBeInstanceOf(IrresolvableBioEntity);
    })
})