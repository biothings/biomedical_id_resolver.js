import _ from 'lodash';
import axios from 'axios';

import { APIMETA, TIMEOUT } from './config';
import {
    MetaDataObject,
    APIFieldMappingObject,
    // ObjectWithStringKeyAndArrayValues,
    // DBIdsObject,
    // BioThingsAPIQueryResponse,
    IndividualResolverOutput,
    // GrpedBioThingsAPIQueryResponse,
  } from './common/types';

import Debug from 'debug';
const debug = Debug('bte:biomedical-id-resolver:AddAttr');

export class AttributeHandler {
    static queryTemplate: string = 'q={inputs}&scopes={scopes}&fields={fields}&dotfield=true&species=human';

    public attributes: object = {};

    private getAPIMetaData(semanticType: string) {
        return APIMETA[semanticType];
    }

    private getReturnFields(fieldMapping: APIFieldMappingObject): string {
        return Object.values(fieldMapping).reduce((prev, current) => prev + current.join(',') + ',', '');
    }

    private getInputScopes(fieldMapping: APIFieldMappingObject, prefix: string): string {
        return fieldMapping[prefix].join(',');
    }

    // private groupResultByQuery(response: BioThingsAPIQueryResponse[]): GrpedBioThingsAPIQueryResponse {
    //     const result = {} as GrpedBioThingsAPIQueryResponse;
    //         for (const rec of response) {
    //         if (!(rec.query in result)) {
    //             result[rec.query] = [];
    //         }
    //         result[rec.query].push(rec);
    //         }
    //         return result;
    //     }

    // getDBIDs(prefix: string, semanticType: string, response: BioThingsAPIQueryResponse[]): IndividualResolverOutput {
    //     const result = {};
    //     const grpedResponse = this.groupResultByQuery(response);
    //     for (const query in grpedResponse) {
    //         const curie = generateCurie(prefix, query);
    //         if (!('notfound' in grpedResponse[query][0])) {
    //         result[curie] = new ResolvableBioEntity(
    //             semanticType,
    //             this.getDBIDsHelper(grpedResponse[query]),
    //             this.getAttributesHelper(grpedResponse[query]),
    //         );
    //         } else {
    //         result[curie] = new IrresolvableBioEntity(semanticType, curie);
    //         }
    //     }
    //     return result;
    // }

    buildOneQuery(metadata: MetaDataObject, prefix: string, inputs: string[]): Promise<IndividualResolverOutput> {
        const idReturnFields = this.getReturnFields(metadata.mapping);
        let attrReturnFields = '';
        if ('additional_attributes_mapping' in metadata) {
            attrReturnFields = this.getReturnFields(metadata.additional_attributes_mapping);
        }
        const returnFields = idReturnFields + attrReturnFields;
        const scopes = this.getInputScopes(metadata.mapping, prefix);
        const biothingsQuery = AttributeHandler.queryTemplate
            .replace('{inputs}', inputs.join(','))
            .replace('{scopes}', scopes)
            .replace('{fields}', returnFields);
        debug(
            `One Axios Query is built--- method: post, url: ${metadata.url}, timeout: ${TIMEOUT}, data: ${biothingsQuery}, inputs: ${inputs}`,
        );
        return axios({
            method: 'post',
            url: metadata.url,
            timeout: TIMEOUT,
            params: {
            fields: returnFields,
            dotfield: true,
            species: 'human',
            },
            data: {
            q: inputs,
            scopes: scopes,
            },
            headers: { 'content-type': 'application/json' },
        }).then((response) => {
            debug(`RESPOSNSE ${JSON.stringify(response.data)}`)
            this.attributes = {
                marco: 'test'
            }
            return response.data;
        });
    }

    async getAttributesFor(semanticType: string, prefix: string, entityID: string) {
        let entityMetadata = this.getAPIMetaData(semanticType);
        await this.buildOneQuery(entityMetadata, prefix, [entityID]);
    }
}

export async function addAttributes(semanticType: string, prefix: string, entityID: string,) {
    debug(`Adding entity attributes of "${entityID}"/prefix: ${prefix}/(${semanticType})`);
    const handler = new AttributeHandler();
    await handler.getAttributesFor(semanticType, prefix, entityID);
    return handler.attributes;
}