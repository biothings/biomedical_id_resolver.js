const config = require("../config");
const _ = require('lodash');

module.exports = class BioThingsParser {
    constructor(response, semanticType, prefix) {
        this.response = response;
        this.semanticType = semanticType;
        this.prefix = prefix;
        this.invalid = [];
    }

    parse() {
        let result = {}
        if (_.isEmpty(this.response.data)) return result;
        let mapping = config.APIMETA[this.semanticType]['mapping'];
        let curie;
        for (let i = 0; i < this.response.data.length; i++) {
            if (_.isEmpty(this.response.data[i])) {
                continue;
            } else if ('notfound' in this.response.data[i]) {
                if (config.CURIE.ALWAYS_PREFIXED.includes(this.prefix)) {
                    curie = this.response.data[i]['query'];
                } else {
                    curie = this.prefix + ':' + this.response.data[i]['query'];
                }
                this.invalid.push(curie);
            } else {
                if (config.CURIE.ALWAYS_PREFIXED.includes(this.prefix)) {
                    curie = this.response.data[i]['query'];
                } else {
                    curie = this.prefix + ':' + this.response.data[i]['query'];
                }
                result[curie] = {}
                for (let [id, fields] of Object.entries(mapping)) {
                    result[curie][id] = new Set();
                    fields.map(field => {
                        if (field in this.response.data[i]) {
                            if (Array.isArray(this.response.data[i][field])) {
                                this.response.data[i][field].map(item => result[curie][id].add(item));
                            } else {
                                result[curie][id].add(this.response.data[i][field]);
                            }
                        }
                    })
                }
            }
        }
        result = this.restructureOutput(result, this.semanticType);
        return result;
    }

    restructureOutput(res, semanticType) {
        let result = {};
        this.invalid.map(curie => {
            let bte_id = curie;
            if (!(config.CURIE.ALWAYS_PREFIXED.includes(curie.split(':')[0]))) {
                bte_id = curie.split(':').slice(-1)[0]
            }
            result[curie] = {
                id: {
                    identifier: curie,
                    label: curie
                },
                ids: [curie],
                bte_ids: {
                    [curie.split(':')[0]]: [bte_id]
                },
                equivalent_identifiers: [
                    {
                        identifier: curie
                    }
                ],
                type: semanticType,
                flag: "failed"
            }
        })
        const ranks = config.APIMETA[semanticType]['id_ranks'];
        Object.keys(res).map(curie => {
            let ids = new Set();
            result[curie] = {
                id: {},
                equivalent_identifiers: [],
                bte_ids: {},
                type: semanticType
            };
            if ("name" in res[curie]) {
                result[curie].id.label = Array.from(res[curie]['name'])[0]
            } else {
                result[curie].id.label = curie
            }
            let primary_id_found = false;
            ranks.map(id => {
                if (res[curie][id] !== undefined && res[curie][id].size > 0) {
                    result[curie]['bte_ids'][id] = Array.from(res[curie][id]);
                    Array.from(res[curie][id]).map(item => {
                        let item_curie = item;
                        if (!(config.CURIE.ALWAYS_PREFIXED.includes(id))) {
                            item_curie = id + ':' + item;
                        };
                        if (primary_id_found === false) {
                            result[curie].id.identifier = item_curie;
                            primary_id_found = true;
                        }
                        result[curie].equivalent_identifiers.push({
                            identifier: item_curie
                        });
                        if (!(id === "name")) {
                            ids.add(item_curie);
                        }
                    })
                }
            });
            result[curie]["ids"] = Array.from(ids);
        })
        return result
    }
}