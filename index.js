const _ = require('lodash');
const APIMETA = require('./config').APIMETA;
const axios = require('axios').default;
const helper = require('./helper');

function findAPIByType(semanticType, idType) {
    if (typeof semanticType !== "string" || typeof idType !== "string") {
        return undefined
    }
    return _.findKey(APIMETA, function(o) {
        return (o["semantic"].toLowerCase() === semanticType.toLowerCase())
            && (_.keys(o['field_mapping']).includes(idType.toLowerCase()))
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
function constructPostQuery(inputs, prefix, api) {
    let query = 'q={inputs}&scopes={scopes}&fields={fields}&dotfield=true';
    if (_.isEmpty(inputs)) {
        return undefined;
    }
    inputs = inputs.join(',');
    if (!(api in APIMETA)) {
        return undefined;
    }
    let meta = APIMETA[api];
    let fields = _.values(meta['field_mapping']).join(',');
    if (!(prefix in meta['field_mapping'])){
        return undefined;
    }
    let scopes = meta['field_mapping'][prefix];
    return axios({
        method: 'post',
        url: meta['base_url'],
        data: query.replace('{inputs}', inputs).replace('{scopes}', scopes).replace('{fields}', fields),
        headers: {'content-type': 'application/x-www-form-urlencoded'}
    })
}

/**
 * Generate an array of API call promises based on the input curies
 * each API call aims at fetching equivalent IDs for the inputs
 * @param {array} curies - input ids in curie format, e.g. ['entrez:1017', 'hgnc:1771'];
 * @param {string} semanticType - the semantic type of the curies, e.g. Gene
 * @returns - An array of API call promises
 */
function generateAPIPromisesByCuries(curies, semanticType) {
    let inputs = helper.groupIdByPrefix(curies);
    let res = [];
    if (_.isEmpty(inputs)){
        return res;
    };
    for (let [prefix, ids] of Object.entries(inputs)) {
        let api = findAPIByType(semanticType, prefix);
        if (_.isUndefined(api)) {
            continue;
        };
        // ids used to be of type Set, which is not accepted by the chunk function
        ids = Array.from(ids);
        // note: maximum length of inputs for BioThings APIs is 1000;
        let chunked_ids = _.chunk(ids, 1000);
        let axiosQuery;
        for (let i = 0; i < chunked_ids.length; i++) {
            axiosQuery = constructPostQuery(chunked_ids[i], prefix, api);
            if (_.isUndefined(axiosQuery)) {
                continue;
            } else {
                res.push(axiosQuery);
            }
        };
    };
    return res;
}



// construct post query
// result should be an array, input ids should be chunked by 1000


// make API call

/**
 * Find API based on baseUrl
 * @param {string} baseUrl - the base url returned by axios response config
 * @returns - the name of the API corresponding to the baseUrl
 */
function findAPIByBaseUrl(baseUrl) {
    if (typeof baseUrl !== "string") {
        return undefined
    }
    return _.findKey(APIMETA, function(o) {
        return o.base_url === baseUrl;
    })
}

// transform API response into BioLink model
/**
 * Tansform the API response into BioLink Model
 * @param {array} res - API response from post query
 * @returns - an object with keys being input id and values being resolved ids
 */
function transformAPIResponse(res) {
    let result = {}
    if (_.isEmpty(res.data)) {
        return result;
    };
    let api = findAPIByBaseUrl(res.config.url);
    if (_.isUndefined(api)) {
        return result;
    }
    let mapping = APIMETA[api]['field_mapping'];
    let scope = helper.extractScopeFromUrl(res.config.data);
    if (_.isUndefined(scope)){
        return result;
    }
    let prefix = _.findKey(mapping, function(o) {return o === scope});
    if (_.isUndefined(prefix)) {
        return result;
    }
    let curie;
    for (let i = 0; i < res.data.length; i++) {
        if (_.isEmpty(res.data[i])) {
            continue;
        } else if ('notfound' in res.data[i]) {
            continue
        } else {
            delete res.data[i]['_id'];
            delete res.data[i]['_score'];
            for (let [key, value] of Object.entries(mapping)) {
                if (value in res.data[i] && value !== key) {
                    res.data[i][key] = res.data[i][value];
                    delete res.data[i][value];
                }
            }
            //TODO: check on GO terms
            curie = prefix + ':' + _.toString(res.data[i]['query']);
            delete res.data[i]['query'];
            result[curie] = res.data[i];
        }
    }
    return result;

}

// 
exports.findAPIByType = findAPIByType;
exports.constructPostQuery = constructPostQuery;
exports.generateAPIPromisesByCuries = generateAPIPromisesByCuries;
exports.findAPIByBaseUrl = findAPIByBaseUrl;
exports.transformAPIResponse = transformAPIResponse;
