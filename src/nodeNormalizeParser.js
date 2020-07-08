const camelcase = require("camelcase");
const config = require("../config");

module.exports = class NodeNormalizeParser {
    constructor(response, mapping) {
        this.response = response.data;
        this.mapping = mapping;
    }

    parse() {
        Object.keys(this.response).map(curie => {
            if (this.response[curie] === null) {
                this.response[curie] = {
                    id: {
                        identifier: curie,
                        label: curie
                    },
                    equivalent_identifiers: [
                        {
                            identifier: curie
                        }
                    ],
                    bte_ids: {
                        [curie.split(':')[0]]: curie
                    },
                    ids: [curie],
                    type: this.mapping[curie],
                    flag: "failed"
                };
            } else {
                this.response[curie].type = camelcase(this.response[curie].type[0], { pascalCase: true });
                this.response[curie].bte_ids = {};
                this.response[curie].ids = [];
                this.response[curie].equivalent_identifiers.map(item => {
                    this.response[curie].ids.push(item.identifier);
                    let [prefix, value] = item.identifier.split(':');
                    if (!(prefix in this.response[curie].bte_ids)) {
                        this.response[curie].bte_ids[prefix] = [];
                    }
                    if (config.CURIE.ALWAYS_PREFIXED.includes(prefix)) {
                        this.response[curie].bte_ids[prefix].push(item.identifier);
                    } else {
                        this.response[curie].bte_ids[prefix].push(value);
                    }
                })
            }
        });
        return this.response;
    }
}