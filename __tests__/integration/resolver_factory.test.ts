import { METADATA, Resolver } from '../../src/index';
import { IrresolvableBioEntity } from '../../src/bioentity/irresolvable_bioentity';


describe("Test Resolver module", () => {
    test("Resolver class should be set correctly if given type biolink", async () => {
        const resolver = new Resolver('biolink');
        const res = await resolver.resolve({ "NamedThing": ["NCBIGENE:1017"] });
        expect(res["NCBIGENE:1017"][0].semanticTypes).toContain("NamedThing");
        expect(res['NCBIGENE:1017'][0].semanticType).toEqual("Gene");
    })

    test("Resolver class should be set correctly if given undefined", async () => {
        const resolver = new Resolver();
        const res = await resolver.resolve({ "NamedThing": ["NCBIGENE:1017"] });
        expect(res["NCBIGENE:1017"][0].semanticTypes).toContain("NamedThing");
        expect(res["NCBIGENE:1017"][0]).toBeInstanceOf(IrresolvableBioEntity);
    })
})

describe("Test API Metadata is correctly exported", () => {
    test("Gene should be part of the METADATA", () => {
        expect(METADATA).toHaveProperty("Gene")
    })
})