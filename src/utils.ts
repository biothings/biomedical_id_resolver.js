import { ResolverSingleOutputObject, ObjectWithStringKeyAndArrayValues } from './common/types';
import { CURIE } from './config'

export function generateCurie(prefix: string, val: string | number): string {
    if (CURIE.ALWAYS_PREFIXED.includes(prefix)) {
        return val.toString();
    } else {
        return prefix + val;
    }
}

export function getPrefixFromCurie(curie: string): string {
    return curie.split(':')[0];
}

export function generateDBID(val: string): string {
    if (!(CURIE.ALWAYS_PREFIXED.includes(val.split(':')[0]))) {
        return val.split(':').slice(-1)[0]
    } else {
        return val;
    }
}

/**
 * Generate a failed response if CURIE could not be resolved
 * @param {string} curie - curie representation of the ID
 * @param {string} type - semantic type
 */
export function generateFailedResponse(curie: string, type: string): ResolverSingleOutputObject {
    return {
        id: {
            identifier: curie,
            label: curie
        },
        curies: [curie],
        db_ids: {
            [curie.split(':')[0]]: [generateDBID(curie)]
        },
        type: type,
        flag: "failed"
    }
}


export function appendArrayOrNonArrayObjectToArray(lst: (string | number)[], item: string | number | (string | number)[]) {
    if (Array.isArray(item)) {
        return [...lst, ...item];
    } else {
        lst.push(item);
        return lst;
    }
}

export function generateObjectWithNoDuplicateElementsInValue(input: ObjectWithStringKeyAndArrayValues): ObjectWithStringKeyAndArrayValues {
    for (const key in input) {
        input[key] = Array.from(new Set(input[key]));
    }
    return input;
}