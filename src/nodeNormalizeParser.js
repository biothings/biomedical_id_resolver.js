const camelcase = require("camelcase");
const config = require("../config");
const utils = require("./utils");

module.exports = class NodeNormalizeParser {
    constructor(response, mapping) {
        this.response = response.data;
        this.mapping = mapping;
    }

    parse() {
        let res = {};
        Object.keys(this.response).map(curie => {
            if (this.response[curie] === null) {
                res[curie] = utils.generateFailedResponse(curie, this.mapping[curie]);
            } else {
                let tmp = {
                    primary: this.response[curie].id,
                    curies: [],
                    db_ids: {},
                    type: camelcase(this.response[curie].type[0], { pascalCase: true })
                };
                this.response[curie].equivalent_identifiers.map(item => {
                    tmp[curie].curies.push(item.identifier);
                    let [prefix, value] = item.identifier.split(':');
                    if (!(prefix in tmp[curie].db_ids)) {
                        tmp[curie].db_ids[prefix] = [];
                    }
                    if (config.CURIE.ALWAYS_PREFIXED.includes(prefix)) {
                        tmp[curie].db_ids[prefix].push(item.identifier);
                    } else {
                        tmp[curie].db_ids[prefix].push(value);
                    }
                });
                res[curie] = tmp;
            }
        });
        return res;
    }
}