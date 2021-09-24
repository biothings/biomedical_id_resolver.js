import _ from 'lodash';
import axios from 'axios';

import { APIMETA, TIMEOUT } from './config';
import {
    MetaDataObject,
    APIFieldMappingObject,
    DBIdsObject,
    BioThingsAPIQueryResponse,
    IndividualResolverOutput,
    GrpedBioThingsAPIQueryResponse,
} from './common/types';
import {
    generateObjectWithNoDuplicateElementsInValue,
    appendArrayOrNonArrayObjectToArray,
    generateCurie,
} from './utils';

import Debug from 'debug';
const debug = Debug('bte:biomedical-id-resolver:AddAttr');

export class AttributeHandler {
    static queryTemplate: string = 'q={inputs}&scopes={scopes}&fields={fields}&dotfield=true&species=human';

    private getAPIMetaData(semanticType: string) {
        return APIMETA[semanticType];
        // Gene: {
        //     id_ranks: ['NCBIGene', 'ENSEMBL', 'HGNC', 'MGI', 'OMIM', 'UMLS', 'SYMBOL', 'UniProtKB', 'name'],
        //     semantic: 'Gene',
        //     api_name: 'mygene.info',
        //     url: 'https://mygene.info/v3/query',
        //     mapping: {
        //       NCBIGene: ['entrezgene'],
        //       name: ['name'],
        //       SYMBOL: ['symbol'],
        //       UMLS: ['umls.cui', 'umls.protein_cui'],
        //       HGNC: ['HGNC'],
        //       UniProtKB: ['uniprot.Swiss-Prot'],
        //       ENSEMBL: ['ensembl.gene'],
        //       OMIM: ['MIM'],
        //       MGI: ['MGI'],
        //     },
        //     additional_attributes_mapping: {
        //       interpro: ['interpro.desc'],
        //       type_of_gene: ['type_of_gene'],
        //     },
        //   },
    }

    private getReturnFields(fieldMapping: APIFieldMappingObject): any {
        try {
            return Object.values(fieldMapping).reduce((prev, current) => prev + current.join(',') + ',', '');
        } catch (error) {
            return false;
        }
    }

    private getInputScopes(fieldMapping: APIFieldMappingObject, prefix: string): any {
        try {
            return fieldMapping[prefix].join(',');
        } catch (error) {
            return false;
        }
    }

    private groupResultByQuery(response: BioThingsAPIQueryResponse[]): GrpedBioThingsAPIQueryResponse {
        const result = {} as GrpedBioThingsAPIQueryResponse;
            for (const rec of response) {
                if (!(rec.query in result)) {
                    result[rec.query] = [];
                }
                result[rec.query].push(rec);
                // "9604": {
                //     "HGNC":"10058",
                //     "MIM":"605675",
                //     "_id":"9604",
                //     "_score":23.930784,
                //     "ensembl.gene":"ENSG00000013561",
                //     "entrezgene":"9604",
                //     "interpro.desc":[
                //        "Zinc finger, RING-type",
                //        "IBR domain",
                //        "RWD domain",
                //        "Zinc finger, RING/FYVE/PHD-type",
                //        "Ubiquitin-conjugating enzyme/RWD-like",
                //        "Zinc finger, RING-type, conserved site",
                //        "E3 ubiquitin ligase RBR family",
                //        "E3 ubiquitin-protein ligase RNF14",
                //        "TRIAD supradomain"
                //     ],
                //     "name":"ring finger protein 14",
                //     "query":"9604",
                //     "symbol":"RNF14",
                //     "type_of_gene":"protein-coding",
                //     "umls.cui":"C1419416",
                //     "uniprot.Swiss-Prot":"Q9UBS8"
                //  }
            }
            return result;
        }

    private getAttributesHelper(records: BioThingsAPIQueryResponse[], semanticType: string): DBIdsObject {
        const res = {} as DBIdsObject;
        const mapping = APIMETA[semanticType].additional_attributes_mapping;
        if (typeof mapping === 'undefined') {
            return res;
        }
        Object.keys(mapping).map((attr) => {
            for (const fieldName of mapping[attr]) {
            records.map((record) => {
                if (fieldName in record) {
                if (!(attr in res)) {
                    res[attr] = [];
                }
                res[attr] = appendArrayOrNonArrayObjectToArray(res[attr], record[fieldName]);
                }
            });
            }
        });
        return generateObjectWithNoDuplicateElementsInValue(res);
        }

    getDBIDs(prefix: string, semanticType: string, response: BioThingsAPIQueryResponse[]): any {
        const grpedResponse = this.groupResultByQuery(response);
        for (const query in grpedResponse) {
            const curie = generateCurie(prefix, query);
            if (!('notfound' in grpedResponse[query][0])) {
                return this.getAttributesHelper(grpedResponse[query], semanticType);
            } else {
                return {};
            }
        }
    }

    buildOneQuery(metadata: MetaDataObject, prefix: string, inputs: string, semanticType: string): Promise<IndividualResolverOutput> {
        const idReturnFields = this.getReturnFields(metadata.mapping);
        let attrReturnFields = '';
        if ('additional_attributes_mapping' in metadata) {
            attrReturnFields = this.getReturnFields(metadata.additional_attributes_mapping);
        }
        const returnFields = idReturnFields + attrReturnFields;
        const scopes = this.getInputScopes(metadata.mapping, prefix);
        if (scopes && idReturnFields) {
            const biothingsQuery = AttributeHandler.queryTemplate
            .replace('{inputs}', inputs)
            .replace('{scopes}', scopes)
            .replace('{fields}', returnFields);
            // debug(
            //     `One Axios Query is built--- method: post, url: ${metadata.url}, timeout: ${TIMEOUT}, data: ${biothingsQuery}, inputs: ${inputs}`,
            // );
            let query : object = {
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
            };
            return axios(query).then((response) => {
                return this.getDBIDs(prefix, semanticType, response.data);
            });
        }else{
            debug(`Cannot get attributes of "${semanticType}"`);
            return;
        }
    }

    async getAttributesFor(semanticType: string, prefix: string, entityID: string) {
        let entityMetadata = this.getAPIMetaData(semanticType);
        return await this.buildOneQuery(entityMetadata, prefix, entityID, semanticType);
    }
}

export async function addAttributes(semanticType: string, entityID: string) : Promise<any> {
    let supported = APIMETA[semanticType];
    if (supported !== undefined) {
        let prefix = entityID.includes(":") ? entityID.split(":")[0] : false;
        if (!prefix) {
            debug(`Could not find ID prefix of "${semanticType}"-${prefix}:${entityID}.`);
            return {};
        }
        entityID = entityID.split(":")[1];
        // debug(`Adding entity attributes of "${semanticType}"-${prefix}:${entityID}`);
        try {
            const handler = new AttributeHandler();
            return await handler.getAttributesFor(semanticType, prefix, entityID);
        } catch (error) {
            debug(`Getting attributes of "${semanticType}"-${prefix}:${entityID} failed.`);
            return {};
        }
    }else{
        debug(`"${semanticType}" is not available in attribute getter.`);
        return {};
    }
}