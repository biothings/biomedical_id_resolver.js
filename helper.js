exports.groupIdByPrefix = function(ids) {
    let res = {};
    //some IDs always appear in CURIE format, e.g. GO, HP
    const ALWAYS_PREFIXED = ['go', 'hp'];
    for (let i = 0; i < ids.length; i++) {
        let splitted = ids[i].split(':');
        if (splitted.length === 1) {
            continue
        } else {
            let prefix = splitted[0].toLowerCase();
            // add prefix as a key in res object if not exist, and initialize the value as empty array
            if (!(prefix in res)) {
                res[prefix] = [];
            }
            let value = splitted.slice(1).join(':');
            if ((ALWAYS_PREFIXED.includes(prefix)) && (prefix !== splitted[1].toLowerCase())) {
                value = prefix.toUpperCase() + ':' + value;
            }
            res[prefix].push(value);
        }
    }
    return res;
}