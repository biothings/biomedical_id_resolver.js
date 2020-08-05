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
        this.response.data.filter(rec => {
            if (_.isEmpty(rec)) {
                return false
            };
            if ('notfound' in rec) {
                if (config.CURIE.ALWAYS_PREFIXED.includes(this.prefix)) {
                    curie = rec['query'];
                } else {
                    curie = this.prefix + ':' + rec['query'];
                }
                this.invalid.push(curie);
                return false;
            };
            return true;
        }).map(rec => {
            if (config.CURIE.ALWAYS_PREFIXED.includes(this.prefix)) {
                curie = rec['query'];
            } else {
                curie = this.prefix + ':' + rec['query'];
            }

            result[curie] = {};
            for (let [id, fields] of Object.entries(mapping)) {
                result[curie][id] = new Set();
                fields.map(field => {
                    if (field in rec) {
                        if (Array.isArray(rec[field])) {
                            rec[field].map(item => result[curie][id].add(item));
                        } else {
                            result[curie][id].add(rec[field]);
                        }
                    }
                })
            }
        });
        result = this.restructureOutput(result, this.semanticType);
        return result;
    }

    restructureOutput(res, semanticType) {
        let result = {};
        this.invalid.map(curie => {
            let db_id = curie;
            if (!(config.CURIE.ALWAYS_PREFIXED.includes(curie.split(':')[0]))) {
                db_id = curie.split(':').slice(-1)[0]
            }
            result[curie] = {
                id: {
                    identifier: curie,
                    label: curie
                },
                curies: [curie],
                db_ids: {
                    [curie.split(':')[0]]: [db_id]
                },
                type: semanticType,
                flag: "failed"
            }
        })
        const ranks = config.APIMETA[semanticType]['id_ranks'];
        Object.keys(res).map(curie => {
            let ids = new Set();
            result[curie] = {
                id: {},
                db_ids: {},
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
                    result[curie]['db_ids'][id] = Array.from(res[curie][id]);
                    Array.from(res[curie][id]).map(item => {
                        let item_curie = item;
                        if (!(config.CURIE.ALWAYS_PREFIXED.includes(id))) {
                            item_curie = id + ':' + item;
                        };
                        if (primary_id_found === false) {
                            result[curie].id.identifier = item_curie;
                            primary_id_found = true;
                        };
                        if (!(id === "name")) {
                            ids.add(item_curie);
                        }
                    })
                }
            });
            result[curie]["curies"] = Array.from(ids);
        })
        return result
    }
}