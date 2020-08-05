const dispatch = require("./dispatch");
const execute = require("./execute");
const utils = require("./utils")

const resolve = async (input) => {
    let result = {};
    let dp = new dispatch(input);
    dp.dispatch();
    Object.keys(dp.invalid).map(type => {
        dp.invalid[type].map(curie => result[curie] = utils.generateFailedResponse(curie, type))
    });
    const valid_res = await execute(Object.values(dp.promises, dp.nodeNormalizeMapping))
    result = { ...result, ...valid_res };
    return result;
}

module.exports = resolve;