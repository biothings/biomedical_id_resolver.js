import axios from 'axios';
import { CURIE } from './config';
import { SRIResolverOutput } from './common/types';

//input: array of curies
export async function query(api_input: string[]) {
  let url: URL = new URL('https://nodenormalization-sri-dev.renci.org/1.1/get_normalized_nodes'); // TODO: change to non-dev version when ready
  //@ts-ignore
  url.search = new URLSearchParams(api_input.map(curie => ["curie", curie]));
  let res = await axios.get(url.toString());
  return res.data;
}

export function transformResults(results): SRIResolverOutput {
  Object.keys(results).forEach((key) => {
    let entry = results[key];
    let id_type = key.split(":")[0];
    if (entry === null) { //handle unresolvable entities
      entry = {
        id: {
          identifier: key,
          label: key
        },
        primaryID: key,
        label: key,
        curies: [key],
        attributes: {},
        semanticType: '',
        semanticTypes: [''],
        dbIDs: {
          [id_type]: CURIE.ALWAYS_PREFIXED.includes(id_type) ? key : key.split(":")[1]
        }
      };
    } else {
      //add fields included in biomedical-id-resolver
      entry.primaryID = entry.id.identifier;
      entry.label = entry.id.label || entry.id.identifier;
      entry.attributes = {};
      entry.semanticType = entry.type[0].split(":")[1]; // get first semantic type without biolink prefix
      entry.semanticTypes = entry.type;

      let names = Array.from(new Set(entry.equivalent_identifiers.map(id_obj => id_obj.label))).filter((x) => (x != null));
      let curies = Array.from(new Set(entry.equivalent_identifiers.map(id_obj => id_obj.identifier))).filter((x) => (x != null));

      entry.curies = [...curies, ...names.map(name => `name:${name}`)];

      //assemble dbIDs
      entry.dbIDs = {}
      entry.equivalent_identifiers.forEach((id_obj) => {
        let id_type = id_obj.identifier.split(":")[0];
        if (CURIE.ALWAYS_PREFIXED.includes(id_type)) {
          if (Array.isArray(entry.dbIDs[id_type])) {
            entry.dbIDs[id_type].push(id_obj.identifier);
          } else {
            entry.dbIDs[id_type] = [id_obj.identifier];
          }
        } else {
          let curie_without_prefix = id_obj.identifier.split(":")[1];
          if (Array.isArray(entry.dbIDs[id_type])) {
            entry.dbIDs[id_type].push(curie_without_prefix);
          } else {
            entry.dbIDs[id_type] = [curie_without_prefix];
          }
        }
      })
      entry.dbIDs.name = names;
    }
    
    results[key] = [entry];
  });
  return results;
}