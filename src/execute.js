const biothings_parser = require("./biothingsParser");
const node_normalize_parser = require("./nodeNormalizeParser");

/**
 * Execute an array of promises sequentially
 * @param {array} promisesArray - an array of promises to be executed sequentially
 * @param {object} mapping - mapping between CURIE and its semantic type
 */
module.exports = async (promisesArray, mapping) => {
    let result = {};
    for (let promises of promisesArray) {
        let res = await Promise.allSettled(promises.map(item => {
            if ("promise" in item) {
                return item.promise
                    .then(response => {
                        let parser = new biothings_parser(response, item.semanticType, item.prefix);
                        let res = parser.parse();
                        return res;
                    })
            } else {
                return item.then(response => {
                    let parser2 = new node_normalize_parser(response, mapping);
                    return parser2.parse();
                })
            }
        }));
        res.map(item => {
            if (item.status === "fulfilled") {
                result = { ...result, ...item.value }
            } else {
                // console.log("failed", item)
            }
        })
    }
    return result;
}

