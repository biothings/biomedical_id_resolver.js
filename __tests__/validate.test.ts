import { Validator } from '../src/validate';
import InvalidIDResolverInputError from '../src/common/exceptions';

describe("Test Validator Class", () => {
    describe("Test validateIfInputIsObject function", () => {
        test("raise exception if input is an array", () => {
            const test_data = ["123"];
            const vd = new Validator(test_data);
            expect(() => vd.validate()).toThrow(InvalidIDResolverInputError);
            expect(() => vd.validate()).toThrow("Your Input to ID Resolver is Invalid. It should be a plain object!");
        })

        test("raise exception if input is a string", () => {
            const test_data = "123";
            const vd = new Validator(test_data);
            expect(() => vd.validate()).toThrow(InvalidIDResolverInputError);
            expect(() => vd.validate()).toThrow("Your Input to ID Resolver is Invalid. It should be a plain object!");
        })
    })

    describe("Test validateIfValuesOfInputIsArray function", () => {
        test("raise exception if input is values of input is string", () => {
            const test_data = { "Gene": "123" };
            const vd = new Validator(test_data);
            expect(() => vd.validate()).toThrow(InvalidIDResolverInputError);
            expect(() => vd.validate()).toThrow("Your Input to ID Resolver is Invalid. All values of your input dictionary should be a list!");
        })

        test("raise exception if input is values of input is an object", () => {
            const test_data = { "Gene": { "Protein": ["PR:001"] } };
            const vd = new Validator(test_data);
            expect(() => vd.validate()).toThrow(InvalidIDResolverInputError);
            expect(() => vd.validate()).toThrow("Your Input to ID Resolver is Invalid. All values of your input dictionary should be a list!");
        })
    })

    describe("Test validateIfEachItemInInputValuesIsCurie function", () => {
        test("raise exception if values of input contains non-string type", () => {
            const test_data = { "Gene": [123] };
            const vd = new Validator(test_data);
            expect(() => vd.validate()).toThrow(InvalidIDResolverInputError);
            expect(() => vd.validate()).toThrow("Your Input to ID Resolver is Invalid. Each item in the values of your input dictionary should be a curie. Spotted 123 is not a curie");
        })

        test("raise exception if values of input contains non-curie type", () => {
            const test_data = { "Gene": ["1234"] };
            const vd = new Validator(test_data);
            expect(() => vd.validate()).toThrow(InvalidIDResolverInputError);
            expect(() => vd.validate()).toThrow("Your Input to ID Resolver is Invalid. Each item in the values of your input dictionary should be a curie. Spotted 1234 is not a curie");
        })
    })

    describe("Test checkIfSemanticTypeCanBeResolved function", () => {
        test("semantic types not appear in APIMeta file should be classified as invalid", () => {
            const test_data = { "Gene": ["NCBIGene:1017"], "Gene1": ["NCBIGene:1018"] };
            const vd = new Validator(test_data);
            vd.validate();
            expect(vd.invalid).toHaveProperty("Gene1");
        })
    })

    describe("Test checkIfPrefixCanBeResolved function", () => {
        test("id prefixes not appear in APIMeta file should be classified as invalid", () => {
            const test_data = { "Gene": ["NCBIGene:1017", "kkk:1323"] };
            const vd = new Validator(test_data);
            vd.validate();
            expect(vd.invalid).toHaveProperty("Gene");
            expect(vd.invalid.Gene).toContain("kkk:1323");
        })
    })

    describe("Test validate function", () => {
        test("valid answers can be retrieved through valid property of the class", () => {
            const test_data = { "Gene": ["NCBIGene:1017", "kkk:1323"], "ChemicalSubstance": ["DRUGBANK:DB0001"] };
            const vd = new Validator(test_data);
            vd.validate();
            expect(vd.valid).toHaveProperty("Gene");
            expect(vd.valid.Gene).toEqual(['NCBIGene:1017']);
            expect(vd.valid).toHaveProperty("ChemicalSubstance");
            expect(vd.valid.ChemicalSubstance).toEqual(["DRUGBANK:DB0001"])
        })
    })
})
