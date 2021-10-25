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
    expect(res["NCBIGene:1017"][0].dbIDs.NCBIGene).toEqual(expect.any(Array));
    expect(res["NCBIGene:1017"][0].dbIDs.name).toEqual(expect.any(Array));
    expect(res["NCBIGene:1017"][0].curies).toEqual(expect.any(Array));
  });

  test("Test unresolvable curie/bad input", async () => {
    let input = {
      "Gene": ["NCBIGene:ABCD", "NCBIGene:GENE:1017"],
    };
    const res = await resolveSRI(input);

    expect(res["NCBIGene:ABCD"]).toEqual(expect.any(Array));
    expect(res["NCBIGene:ABCD"][0].semanticType).toEqual("Gene");
    expect(res["NCBIGene:ABCD"][0].primaryID).toEqual("NCBIGene:ABCD");
    expect(res["NCBIGene:ABCD"][0].label).toEqual("NCBIGene:ABCD");
    expect(res["NCBIGene:ABCD"][0].dbIDs.name).toEqual(expect.any(Array));
    expect(res["NCBIGene:ABCD"][0].dbIDs.NCBIGene).toEqual(expect.any(Array));

    expect(res["NCBIGene:GENE:1017"]).toEqual(expect.any(Array));
    expect(res["NCBIGene:GENE:1017"][0].semanticType).toEqual("Gene");
    expect(res["NCBIGene:GENE:1017"][0].primaryID).toEqual("NCBIGene:GENE:1017");
    expect(res["NCBIGene:GENE:1017"][0].label).toEqual("NCBIGene:GENE:1017");
    expect(res["NCBIGene:GENE:1017"][0].dbIDs.name).toEqual(expect.any(Array));
    expect(res["NCBIGene:GENE:1017"][0].dbIDs.NCBIGene).toEqual(expect.any(Array));
  });

  test("Test SRI Semantic type resolver with unknown", async () => {
    let input = {
      unknown: ["NCBIGene:3778"],
    };
    const res = await resolveSRI(input);

    expect(res["NCBIGene:3778"]).toEqual(expect.any(Array));
    expect(res["NCBIGene:3778"][0].semanticType).toEqual("Gene");
  })

  test("Test SRI Semantic type resolver with undefined", async () => {
    let input = {
      undefined: ["NCBIGene:3778"],
    };
    const res = await resolveSRI(input);

    expect(res["NCBIGene:3778"]).toEqual(expect.any(Array));
    expect(res["NCBIGene:3778"][0].semanticType).toEqual("Gene");
  })

  test("Test SRI Semantic type resolver with NamedThing", async () => {
    let input = {
      NamedThing: ["NCBIGene:3778"],
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

    expect(res["NCBIGene:1017"].length).toBe(2);
    expect(res["NCBIGene:1017"][0].semanticType).toEqual("Gene");
    expect(res["NCBIGene:1017"][1].semanticType).toEqual("Disease");
  });

  test("Test using SRI to get semantic types", async () => {
    let input = {
      unknown: ["NCBIGene:1017"]
    };
    const res = await resolveSRI(input);

    expect(res["NCBIGene:1017"].length).toBe(1);
    expect(res["NCBIGene:1017"][0].semanticType).toEqual("Gene");
  });

  test("Test handling semantic type conflicts", async () => {
    let input = {
      "SmallMolecule": ["PUBCHEM.COMPOUND:23680530"]
    };
    const res = await resolveSRI(input);

    expect(res["PUBCHEM.COMPOUND:23680530"].length).toBe(2);
    expect(res["PUBCHEM.COMPOUND:23680530"][0].semanticType).toEqual("MolecularMixture");
    expect(res["PUBCHEM.COMPOUND:23680530"][1].semanticType).toEqual("SmallMolecule");
  });

  test("Test large batch of inputs should be correctly resolved and should not give an error", async () => {
    const fakeNCBIGeneInputs = [...Array(15000).keys()].map(item => 'NCBIGene:' + item.toString());
    let input = {
      Gene: fakeNCBIGeneInputs,
    };
    const res = await resolveSRI(input);

    expect(Object.keys(res)).toHaveLength(fakeNCBIGeneInputs.length);
    expect(res["NCBIGene:1"]).toEqual(expect.any(Array));
  })

});
