/**
 * Generate a failed response if CURIE could not be resolved
 * @param {string} curie - curie representation of the ID
 * @param {string} type - semantic type
 */
const generateFailedResponse = (curie, type) => {
    return {
        id: {
            identifier: curie,
            label: curie
        },
        curies: [curie],
        db_ids: {
            [curie.split(':')[0]]: [curie]
        },
        type: type,
        flag: "failed"
    }
}

module.exports = { generateFailedResponse }