import axios from 'axios';
import { CURIE } from './config';
import { SRIResolverOutput, ResolverInput } from './common/types';
import Debug from 'debug';
import _ from 'lodash';
const debug = Debug('bte:biomedical-id-resolver:SRI');
import { addAttributes } from './attr';

//input: array of curies
async function query(api_input: string[]) {
  let url: URL = new URL('https://nodenormalization-sri-dev.renci.org/1.1/get_normalized_nodes'); // TODO: change to non-dev version when ready

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

async function transformResults(results, semanticType: string): Promise<SRIResolverOutput> {
  let cached : object = {};
  for (const entityID of Object.keys(results)) {
    let entry = results[entityID];
    let id_type = entityID.split(":")[0];
    if (entry === null) { //handle unresolvable entities
      entry = {
        id: {
          identifier: entityID,
          label: entityID
        },
        primaryID: entityID,
        label: entityID,
        curies: [entityID],
        attributes: {},
        semanticType: semanticType,
        _leafSemanticType: semanticType,
        semanticTypes: [semanticType],
        dbIDs: {
          [id_type]: [CURIE.ALWAYS_PREFIXED.includes(id_type) ? entityID : entityID.split(":")[1]],
          name: [entityID]
        },
        _dbIDs: {
          [id_type]: [CURIE.ALWAYS_PREFIXED.includes(id_type) ? entityID : entityID.split(":")[1]],
          name: [entityID]
        }
      };
    } else {
      //add fields included in biomedical-id-resolver
      entry.primaryID = entry.id.identifier;
      entry.label = entry.id.label || entry.id.identifier;
      entry.attributes = {};
      entry.semanticType = entry.type[0].split(":")[1]; // get first semantic type without biolink prefix
      if (semanticType !== entry.semanticType) {
        debug(`SRI resolved semantic type ${entry.semanticType} doesn't match input semantic type ${semanticType} for curie ${entry.primaryID}.`);
      }
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

      entry._leafSemanticType = entry.semanticType;
      entry._dbIDs = entry.dbIDs;
    }
    if (!Object.prototype.hasOwnProperty.call(cached, entityID)) {
      let attributes = await addAttributes(semanticType, entityID);
      cached[entityID] = attributes;
      entry.attributes = attributes;
    }else{
      entry.attributes = cached[entityID];
    }
    results[entityID] = [entry];
  }
  return results;
}

export async function _resolveSRI(userInput: ResolverInput): Promise<SRIResolverOutput> {
  let results = await Promise.all(Object.keys(userInput).map(async (semanticType) => {
    let query_results = await query(userInput[semanticType]);
    return transformResults(query_results, semanticType);
  }));

  return Object.assign({}, ...results); //convert array of objects into single object
}