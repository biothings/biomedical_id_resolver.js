const biothings_parser = require("./biothingsParser");
const node_normalize_parser = require("./nodeNormalizeParser");
const dispatch = require("./dispatch");

const resolve = async (input) => {
    let result = {};
    let dp = new dispatch(input);
    dp.dispatch();
    Object.keys(dp.invalid).map(type => {
        dp.invalid[type].map(curie => {
            result[curie] = {
                id: {
                    identifier: curie,
                    label: curie
                },
                ids: [curie],
                bte_ids: {
                    [curie.split(':')[0]]: [curie]
                },
                equivalent_identifiers: [
                    {
                        identifier: curie
                    }
                ],
                type: type,
                flag: "failed"
            }
        })
    });
    for (let i of Object.keys(dp.promises)) {
        let res = await Promise.allSettled(dp.promises[i].map(item => {
            if ("promise" in item) {
                return item.promise
                    .then(response => {
                        let parser = new biothings_parser(response, item.semanticType, item.prefix);
                        return parser.parse();
                    })
            } else {
                return item.then(response => {
                    let parser2 = new node_normalize_parser(response, dp.nodeNormalizeMapping);
                    return parser2.parse();
                })
            }
        }));
        res.map(item => {
            if (item.status === "fulfilled") {
                result = { ...result, ...item.value }
            } else {
                console.log('failed', item);
            }
        })
    }
    return result;
}

module.exports = resolve;