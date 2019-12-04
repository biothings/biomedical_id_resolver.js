const _ = require('lodash');
const APIMETA = require('./config').APIMETA;
const axios = require('axios').default;

exports.findAPIByType = function(semanticType, idType) {
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
 * The return value is an array of axios post query promises
 * @param {array} inputs - Input IDs
 * @param {string} prefix - The ID type of the inputs, e.g. hgnc
 * @param {string} api - The API used to query the input IDs 
 * @returns - The array of axios post query promises
 */
exports.constructPostQuery = function(inputs, prefix, api) {
    let query = 'q={inputs}&scopes={scopes}&fields={fields}&dotfield=true';
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

// construct post query
// result should be an array, input ids should be chunked by 1000


// make API call

// transform API response into BioLink model

// 