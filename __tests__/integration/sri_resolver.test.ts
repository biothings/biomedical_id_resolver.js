import { resolveSRI } from '../../src/index';

describe("Test SRI Resolver", () => {
  test("Test old format", async () => {
    let input = {
      "Gene": ["NCBIGene:1017", "NCBIGene:1018", "HGNC:1177"],
      "SmallMolecule": ["CHEBI:15377"],
      "Disease": ["MONDO:0004976"],
      "Cell": ["CL:0002372"]
    };
    const res = await resolveSRI(input);
    expect(res["NCBIGene:1017"]).toEqual(expect.any(Array));
    expect(res["NCBIGene:1017"][0].primaryID).toEqual("NCBIGene:1017");
    expect(res["NCBIGene:1017"][0].label).toEqual("CDK2");
    expect(res["NCBIGene:1017"][0].semanticType).toEqual("Gene");
    expect(res["NCBIGene:1017"][0].semanticTypes).toEqual(expect.any(Array));
    expect(res["NCBIGene:1017"][0].dbIDs).toEqual(expect.any(Object));
  });

  test("Test unresolvable curie", async () => {
    let input = {
      "Gene": ["NCBIGene:ABCD"],
    };
    const res = await resolveSRI(input);
    expect(res["NCBIGene:ABCD"]).toEqual(expect.any(Array));
    expect(res["NCBIGene:ABCD"][0].primaryID).toEqual("NCBIGene:ABCD");
    expect(res["NCBIGene:ABCD"][0].label).toEqual("NCBIGene:ABCD");
    expect(res["NCBIGene:ABCD"][0].dbIDs.name).toEqual(expect.any(Array));
    expect(res["NCBIGene:ABCD"][0].dbIDs.NCBIGene).toEqual(expect.any(Array));
  });

  test("Test SRI Semantic type resolver", async () => {
    let input = {
      unknown: ["NCBIGene:3778"],
    };
    const res = await resolveSRI(input);
    expect(res["NCBIGene:3778"]).toEqual(expect.any(Array));
    expect(res["NCBIGene:3778"][0].semanticType).toEqual("Gene");
  })

  test("Test Same ID different semantic types", async () => {
    let input = {
      "Gene": ["NCBIGene:1017"],
      "Disease": ["NCBIGene:1017"]
    };
    const res = await resolveSRI(input);
    expect(res["NCBIGene:1017"].length).toBeGreaterThan(1);
  });

});
