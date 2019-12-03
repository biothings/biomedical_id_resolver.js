const _ = require('lodash');
const APIMETA = require('./config').APIMETA;

exports.findAPIByType = function(semanticType, idType) {
    if (typeof semanticType !== "string" || typeof idType !== "string") {
        return undefined
    }
    return _.findKey(APIMETA, function(o) {
        return (o["semantic"].toLowerCase() === semanticType.toLowerCase())
            && (_.keys(o['field_mapping']).includes(idType.toLowerCase()))
    })
}