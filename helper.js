const _ = require('lodash');

/**
 * group the input ids(curies) based on prefix
 * @param {Array} ids - input curies
 * @returns - an object with keys being prefix
 * note: 'invalid' field contains all ids which are not curie compatible
 */
exports.groupIdByPrefix = function(ids) {
    if (!(_.isArray(ids))) {
        // console.error('The input is not an array');
        return {};
    }
    let res = {'invalid': new Set(), 'mapping': {}};
    //some IDs always appear in CURIE format, e.g. GO, HP
    const ALWAYS_PREFIXED = ['go', 'hp', 'mondo', 'doid'];
    const STRINGIFY = ['go', 'hp', 'mondo', 'doid', 'name']
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
            let prefix = splitted[0].toLowerCase();
            // add prefix as a key in res object if not exist, and initialize the value as empty array
            if (!(prefix in res)) {
                res[prefix] = new Set();
            }
            let value = splitted.slice(1).join(':');
            if ((ALWAYS_PREFIXED.includes(prefix)) && (prefix !== splitted[1].toLowerCase())) {
                value = prefix.toUpperCase() + ':' + value;
            }
            res['mapping'][(prefix + ":" + value)] = ids[i];
            if (STRINGIFY.includes(prefix)){
                value = '"' + value + '"';
            }
            res[prefix].add(value);
        }
    }
    if (_.isEmpty(res['invalid'])){
        delete res['invalid'];
    }
    if (_.isEmpty(res['mapping'])){
        delete res['mapping'];
    }
    return res;
}

/**
 * extract the scope information from post query data
 * @param {string} url - the post query data
 * @returns - the value of the scope field
 */
exports.extractScopeFromUrl = function(url) {
    let myRegexp = /scopes=(.*)&fields/;
    let matched = myRegexp.exec(url);
    if (matched) {
        return matched[1];
    } else {
        return undefined;
    }
}

/**
 * extract the API information from post query data
 * @param {string} url - the post query data
 * @returns - the value of the scope field
 */
exports.extractAPIFromUrl = function(url) {
    let myRegexp = /&api=(.*)/;
    let matched = myRegexp.exec(url);
    if (matched) {
        return matched[1];
    } else {
        return undefined;
    }
}