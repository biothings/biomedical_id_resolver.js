import axios from 'axios';
import { CURIE } from './config';
import { SRIResolverOutput, ResolverInput, SRIBioEntity } from './common/types';
import Debug from 'debug';
import _ from 'lodash';
const debug = Debug('bte:biomedical-id-resolver:SRI');
import {addAttributes} from './attr';

//convert object of arrays into array of unique IDs
function combineInputs(userInput: ResolverInput): string[] {
  let result = Object.keys(userInput).reduce(function (r, k) {
    return r.concat(userInput[k]);
  }, []);
  return [...new Set(result)];
}

//input: array of curies
//handles querying and batching of inputs
async function query(api_input: string[]) {
  let url: URL = new URL('https://nodenormalization-sri.renci.org/1.2/get_normalized_nodes');

  //SRI returns a 414 error if the length of the url query is greater than 65536, split into chunks of 1500 curies to be on the safe side (lower number if still running into 414 errors)
  let chunked_input = _.chunk(api_input, 1500); 

  let axios_queries = chunked_input.map((input) => {
    //@ts-ignore
    url.search = new URLSearchParams(input.map(curie => ["curie", curie]));
    return axios.get(url.toString());
  });

  //convert res array into single object with all curies
  let res = await Promise.all(axios_queries);
  res = res.map(r => r.data);
  return Object.assign({}, ...res);
}

//build id resolution object for curies that couldn't be resolved
function UnresolvableEntry(curie: string, semanticType: string): SRIBioEntity {
  let id_type = curie.split(":")[0];
  return {
    id: {
      identifier: curie,
      label: curie
    },
    equivalent_identifiers: [{
      identifier: curie,
      label: curie
    }],
    primaryID: curie,
    label: curie,
    curies: [curie],
    attributes: {},
    semanticType: semanticType,
    _leafSemanticType: semanticType,
    type: [semanticType],
    semanticTypes: [semanticType],
    dbIDs: {
      [id_type]: [CURIE.ALWAYS_PREFIXED.includes(id_type) ? curie : curie.split(":")[1]],
      name: [curie]
    },
    _dbIDs: {
      [id_type]: [CURIE.ALWAYS_PREFIXED.includes(id_type) ? curie: curie.split(":")[1]],
      name: [curie]
    }
  }
}

//build id resolution object for curies that were successfully resolved by SRI
async function ResolvableEntry(SRIEntry): Promise<SRIBioEntity>{
  let entry = SRIEntry;
  
  //add fields included in biomedical-id-resolver
  entry.primaryID = entry.id.identifier;
  entry.label = entry.id.label || entry.id.identifier;
  let at = await addAttributes(entry.type, entry.primaryID);
  entry.attributes = at;
  entry.semanticType = entry.type[0].split(":")[1]; // get first semantic type without biolink prefix
  entry._leafSemanticType = entry.semanticType;
  entry.semanticTypes = entry.type;

  let names = Array.from(new Set(entry.equivalent_identifiers.map(id_obj => id_obj.label))).filter((x) => (x != null));
  let curies = Array.from(new Set(entry.equivalent_identifiers.map(id_obj => id_obj.identifier))).filter((x) => (x != null));

  entry.curies = [...curies];

  //assemble dbIDs
  entry.dbIDs = {}
  entry.equivalent_identifiers.forEach((id_obj) => {
    let id_type = id_obj.identifier.split(":")[0];
    if (!Array.isArray(entry.dbIDs[id_type])) {
      entry.dbIDs[id_type] = [];
    }

    if (CURIE.ALWAYS_PREFIXED.includes(id_type)) {
      entry.dbIDs[id_type].push(id_obj.identifier);
    } else {
      let curie_without_prefix = id_obj.identifier.split(":")[1];
      entry.dbIDs[id_type].push(curie_without_prefix);
    }
  })
  entry.dbIDs.name = names;
  entry._dbIDs = entry.dbIDs;
  return entry;
}

//transform output from SRI into original resolver shape
async function transformResults(results): Promise<SRIResolverOutput> {
  //forEach does not wait for async calls
  for (let i = 0; i < Object.keys(results).length; i++) {
    const key = Object.keys(results)[i];
    let entry = results[key];
    if (entry === null) { //handle unresolvable entities
      entry = UnresolvableEntry(key, null);
    } else {
      entry = await ResolvableEntry(entry);
    }
    results[key] = [entry];
  }
  return results;
}

//add entries with original semantic types if they don't match the SRI resolved types
function mapInputSemanticTypes(originalInput: ResolverInput, result: SRIResolverOutput): SRIResolverOutput {
  Object.keys(originalInput).forEach((semanticType) => {
    if (semanticType === 'unknown' || semanticType === 'undefined' || 
      semanticType === 'NamedThing') { //rely on SRI type if input is unknown, undefined, or NamedThing
      return;
    }

    let uniqueInputs = [...new Set(originalInput[semanticType])];
    uniqueInputs.forEach((curie) => {
      let entry = result[curie][0];
      if (!entry.semanticType) {
        entry._leafSemanticType = semanticType;
        entry.semanticType = semanticType;
        entry.semanticTypes = [semanticType];
        entry.type = [semanticType];
      } else if (entry.semanticType !== semanticType) { //add entry if SRI semantic type doesn't match input semantic type
        debug(`SRI resolved type '${entry.semanticType}' doesn't match input semantic type '${semanticType}' for curie '${entry.primaryID}'. Adding entry for '${semanticType}'.`)
        let new_entry = _.cloneDeep(entry);

        new_entry._leafSemanticType = semanticType;
        new_entry.semanticType = semanticType;
        new_entry.semanticTypes[0] = semanticType;
        new_entry.type[0] = semanticType;

        result[curie].push(new_entry);
      }
    })
  })

  return result;
}

export async function _resolveSRI(userInput: ResolverInput): Promise<SRIResolverOutput> {
  let uniqueInputIDs = combineInputs(userInput);

  let queryResults = await query(uniqueInputIDs);

  queryResults = await transformResults(queryResults);

  queryResults = mapInputSemanticTypes(userInput, queryResults);

  return queryResults;
}