import axios from 'axios';
import _ from 'lodash';

import {
  MetaDataObject,
  APIFieldMappingObject,
  ObjectWithStringKeyAndArrayValues,
  DBIdsObject,
  BioThingsAPIQueryResponse,
  IndividualResolverOutput,
  GrpedBioThingsAPIQueryResponse,
} from '../../common/types';
import { APIMETA, TIMEOUT, MAX_BIOTHINGS_INPUT_SIZE } from '../../config';
import {
  generateDBID,
  generateObjectWithNoDuplicateElementsInValue,
  appendArrayOrNonArrayObjectToArray,
  generateCurie,
} from '../../utils';
import { ResolvableBioEntity } from '../../bioentity/valid_bioentity';
import { IrresolvableBioEntity } from '../../bioentity/irresolvable_bioentity';
import { QueryBuilder } from './base_builder';
import Debug from 'debug';
const debug = Debug('biomedical-id-resolver:QueryBuilder');

export class BioThingsQueryBuilder extends QueryBuilder {
  static queryTemplate: string = 'q={inputs}&scopes={scopes}&fields={fields}&dotfield=true&species=human';

  private getReturnFields(fieldMapping: APIFieldMappingObject): string {
    return Object.values(fieldMapping).reduce((prev, current) => prev + current.join(',') + ',', '');
  }

  private getInputScopes(fieldMapping: APIFieldMappingObject, prefix: string): string {
    return fieldMapping[prefix].join(',');
  }

  private groupCuriesByPrefix(curies: string[]): ObjectWithStringKeyAndArrayValues {
    const grped: ObjectWithStringKeyAndArrayValues = {};
    curies.map((curie) => {
      const prefix = curie.split(':')[0];
      if (!(prefix in grped)) {
        grped[prefix] = [];
      }
      grped[prefix].push(generateDBID(curie));
    });
    return generateObjectWithNoDuplicateElementsInValue(grped);
  }

  private getDBIDsHelper(records: BioThingsAPIQueryResponse[]): DBIdsObject {
    const res = {} as DBIdsObject;
    const mapping = APIMETA[this.semanticType].mapping;
    Object.keys(mapping).map((prefix) => {
      for (const fieldName of mapping[prefix]) {
        records.map(record => {
          if (fieldName in record) {
            if (!(prefix in res)) {
              res[prefix] = [];
            }
            res[prefix] = appendArrayOrNonArrayObjectToArray(res[prefix], record[fieldName]);
          }
        })
      }
    });
    return generateObjectWithNoDuplicateElementsInValue(res);
  }

  private groupResultByQuery(response: BioThingsAPIQueryResponse[]): GrpedBioThingsAPIQueryResponse {
    const result = {} as GrpedBioThingsAPIQueryResponse;
    for (const rec of response) {
      if (!(rec.query in result)) {
        result[rec.query] = [];
      }
      result[rec.query].push(rec);
    }
    return result;
  }

  getDBIDs(prefix: string, semanticType: string, response: BioThingsAPIQueryResponse[]): IndividualResolverOutput {
    const result = {};
    debug(`Raw Query result: ${JSON.stringify(response)}`);
    const grpedResponse = this.groupResultByQuery(response);
    debug(`Grped Query Result: ${JSON.stringify(grpedResponse)}`);
    for (const query in grpedResponse) {
      const curie = generateCurie(prefix, query);
      if (!('notfound' in grpedResponse[query][0])) {
        result[curie] = new ResolvableBioEntity(semanticType, this.getDBIDsHelper(grpedResponse[query]));
      } else {
        result[curie] = new IrresolvableBioEntity(semanticType, curie);
      }
    }
    return result;
  }

  buildOneQuery(metadata: MetaDataObject, prefix: string, inputs: string[]): Promise<IndividualResolverOutput> {
    const returnFields = this.getReturnFields(metadata.mapping);
    const scopes = this.getInputScopes(metadata.mapping, prefix);
    const biothingsQuery = BioThingsQueryBuilder.queryTemplate
      .replace('{inputs}', inputs.join(','))
      .replace('{scopes}', scopes)
      .replace('{fields}', returnFields);
    debug(
      `One Axios Query is built--- method: post, url: ${metadata.url}, timeout: ${TIMEOUT}, data: ${biothingsQuery}`,
    );
    return axios({
      method: 'post',
      url: metadata.url,
      timeout: TIMEOUT,
      data: biothingsQuery,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
    }).then((response) => this.getDBIDs(prefix, this.semanticType, response.data));
  }

  buildQueries(metadata: MetaDataObject, prefix: string, inputs: string[]) {
    return _.chunk(inputs, MAX_BIOTHINGS_INPUT_SIZE).map((batch) => this.buildOneQuery(metadata, prefix, batch));
  }

  build() {
    const grped = this.groupCuriesByPrefix(this.curies);
    return Object.keys(grped).reduce((prev, current) => {
      prev = [...prev, ...this.buildQueries(this.getAPIMetaData(this.semanticType), current, grped[current])];
      return prev;
    }, []);
  }
}
