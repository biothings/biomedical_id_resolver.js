import { ObjectWithStringKeyAndArrayValues } from './common/types';
import { CURIE } from './config'

export function generateCurie(prefix: string, val: string | number): string {
    if (CURIE.ALWAYS_PREFIXED.includes(prefix)) {
        return val.toString();
    } else {
        return prefix + ':' + val.toString();
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


export function appendArrayOrNonArrayObjectToArray(lst: any[], item: any) {
    if (Array.isArray(item)) {
        return [...lst, ...item];
    } else {
        lst.push(item);
        return lst;
    }
}

export function generateObjectWithNoDuplicateElementsInValue(input: ObjectWithStringKeyAndArrayValues): ObjectWithStringKeyAndArrayValues {
    Object.keys(input).map(key => {
        input[key] = Array.from(new Set(input[key]));
    })
    return input;
}