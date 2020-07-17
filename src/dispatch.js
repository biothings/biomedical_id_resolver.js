const _ = require('lodash');
const config = require('../config');
const axios = require('axios').default;


SEMANTIC_TYPES_HANDLED_BY_BIOTHINGS = Object.keys(config.APIMETA).filter(item => config.APIMETA[item]['url'] !== 'https://nodenormalization-sri.renci.org/get_normalized_nodes')

/**
 * Take user input IDs and translate into API query
 */
module.exports = class Dispatcher {
    constructor(inputIDs) {
        this.inputIDs = inputIDs;
        this.promises = { 0: [] };
        this.invalid = {};
        this.nodeNormalizeMapping = {};
    }

    dispatch() {
        let idsNodeNormalize = new Set();
        Object.keys(this.inputIDs).map(semanticType => {
            if (SEMANTIC_TYPES_HANDLED_BY_BIOTHINGS.includes(semanticType)) {
                let res = this.generateBioThingsAPIPromisesByCuries(this.inputIDs[semanticType], semanticType);
                let chunked_promises = _.chunk(res.valid, 5);
                chunked_promises.map((item, i) => {
                    if (!(i in this.promises)) {
                        this.promises[i] = [];
                    };
                    this.promises[i] = [...this.promises[i], ...item];
                })
                this.invalid[semanticType] = res.invalid;
            } else {
                this.inputIDs[semanticType].map(item => {
                    idsNodeNormalize.add(item);
                    this.nodeNormalizeMapping[item] = semanticType
                })
            }
        });
        let res2 = this.generateNodeNormalizeAPIPromisesByCuries(idsNodeNormalize);
        this.promises[0] = [...this.promises[0], ...res2];
    }

    groupIdByPrefix(ids, semantic_type) {
        if (!(_.isArray(ids))) {
            // console.error('The input is not an array');
            return {};
        }
        let res = { 'invalid': new Set(), 'mapping': {} };
        for (let i = 0; i < ids.length; i++) {
            if (_.isNumber(ids[i])) {
                res['invalid'].add(_.toString(ids[i]));
                continue
            } else if (typeof ids[i] !== 'string') {
                // console.error('Each element in the input array must be string, invalid input : ', ids[i])
                continue
            }
            let splitted = ids[i].split(':');
            if (splitted.length === 1) {
                res['invalid'].add(ids[i]);
            } else {
                let prefix = splitted[0];
                if (!(config.APIMETA[semantic_type].id_ranks.includes(prefix))) {
                    res['invalid'].add(ids[i]);
                    continue
                }
                // add prefix as a key in res object if not exist, and initialize the value as empty array
                if (!(prefix in res)) {
                    res[prefix] = new Set();
                }
                let value = splitted.slice(1).join(':')
                if ((config.CURIE.ALWAYS_PREFIXED.includes(prefix)) && (prefix !== splitted[1])) {
                    value = prefix + ':' + value;
                }
                res['mapping'][(prefix + ":" + value)] = ids[i];
                // if (config.CURIE.ALWAYS_PREFIXED.includes(prefix)) {
                //     value = '"' + value + '"';
                // }
                value = '"' + value + '"';
                res[prefix].add(value);
            }
        }
        if (_.isEmpty(res['invalid'])) {
            delete res['invalid'];
        }
        if (_.isEmpty(res['mapping'])) {
            delete res['mapping'];
        }
        return res;
    }

    /**
     * 
     * @param {string} semanticType - semantic type of the input 
     * @param {string} idType - identifier type of the input
     */
    findAPIByType(semanticType, idType) {
        if (typeof semanticType !== "string" || typeof idType !== "string") {
            return undefined
        }
        return _.findKey(config.APIMETA, function (o) {
            return (o["semantic"] === semanticType)
                && (_.keys(o['field_mapping']).includes(idType))
        })
    }

    /**
     * construct a BioThings batch query using axios
     * The query aims to fetch all equivalent IDs for the inputs
     * note: the input IDs must be less than 1000;
     * The return value is an axios post query promises
     * @param {array} inputs - Input IDs
     * @param {string} prefix - The ID type of the inputs, e.g. hgnc
     * @param {string} api - The API used to query the input IDs 
     * @returns - an axios post query promise
     */
    constructBioThingsPostQuery(inputs, semantic_type, prefix) {
        let query = 'q={inputs}&scopes={scopes}&fields={fields}&dotfield=true';
        if (_.isEmpty(inputs)) {
            return undefined;
        }
        inputs = inputs.join(',');
        if (!(semantic_type in config.APIMETA)) {
            return undefined;
        }
        let meta = config.APIMETA[semantic_type];
        let fields = [];
        Object.values(meta['mapping']).map(item => {
            fields = [...fields, ...item];
        });
        fields = fields.join(',');
        if (!(prefix in meta['mapping'])) {
            return undefined;
        }
        let scopes = meta['mapping'][prefix].join(',');
        query = query.replace('{inputs}', inputs).replace('{scopes}', scopes).replace('{fields}', fields);
        return axios({
            method: 'post',
            url: meta['url'],
            timeout: 10000,
            data: query,
            headers: { 'content-type': 'application/x-www-form-urlencoded' }
        })
    }

    /**
     * construct a NodeNormalize batch query using axios
     * The query aims to fetch all equivalent IDs for the inputs
     * note: the input IDs must be less than 1000;
     * The return value is an axios post query promises
     * @param {array} inputs - Input curies
     * @returns - an axios post query promise
     */
    constructNodeNormalizeQuery(inputs) {
        let url = 'https://nodenormalization-sri.renci.org/get_normalized_nodes?';
        let params = [];
        inputs.map(curie => {
            params.push('curie=' + curie);
        });
        params = params.join("&");
        return axios({
            method: 'get',
            url: url + params,
            timeout: 3000,
            headers: { 'content-type': 'application/x-www-form-urlencoded' }
        })
    }

    /**
     * Generate an array of API call promises based on the input curies
     * each API call aims at fetching equivalent IDs for the inputs
     * @param {Array} curies - input ids in curie format, e.g. ['entrez:1017', 'hgnc:1771'];
     * @param {String} semanticType - the semantic type of the curies, e.g. Gene
     * @returns - An object, the "valid" field contains an array of API call promises, the "invalid" field contains ids which can not be transformed
     */
    generateBioThingsAPIPromisesByCuries(curies, semanticType) {
        let inputs = this.groupIdByPrefix(curies, semanticType);
        let res = { 'valid': [], 'invalid': [] };
        if (_.isEmpty(inputs)) {
            return res;
        };
        for (let [prefix, ids] of Object.entries(inputs)) {
            if (prefix === 'invalid') {
                res['invalid'] = Array.from(ids);
                continue
            }
            if (prefix === 'mapping') {
                res['mapping'] = ids;
                continue
            }
            // ids used to be of type Set, which is not accepted by the chunk function
            ids = Array.from(ids);
            // note: maximum length of inputs for BioThings APIs is 1000;
            let chunked_ids = _.chunk(ids, 1000);
            let axiosQuery;
            for (let i = 0; i < chunked_ids.length; i++) {
                axiosQuery = this.constructBioThingsPostQuery(chunked_ids[i], semanticType, prefix);
                if (_.isUndefined(axiosQuery)) {
                    chunked_ids[i] = chunked_ids.map(item => prefix + ':' + item);
                    res['invalid'] = [...res['invalid'], ...chunked_ids[i]];
                } else {
                    res['valid'].push({
                        semanticType: semanticType,
                        prefix: prefix,
                        promise: axiosQuery
                    });
                }
            };
        };
        return res;
    }

    /**
     * Generate an array of API call promises based on the input curies
     * each API call aims at fetching equivalent IDs for the inputs
     * @param {Array} curies - input ids in curie format, e.g. ['entrez:1017', 'hgnc:1771'];
     * @returns - An array with each element as a axios promise
     */
    generateNodeNormalizeAPIPromisesByCuries(curies) {
        let res = [];
        if (curies.length === 0) {
            return res;
        };
        curies = Array.from(curies);
        // note: maximum length of inputs for Node Normalization APIs is 1000;
        let chunked_ids = _.chunk(curies, 1000);
        let axiosQuery;
        for (let i = 0; i < chunked_ids.length; i++) {
            axiosQuery = this.constructNodeNormalizeQuery(chunked_ids[i])
            if (_.isUndefined(axiosQuery)) {
                continue;
            } else {
                res.push(axiosQuery);
            }
        };
        return res;
    }
}
