import { DBIdsObject, ValidSemanticTypes } from './common/types';
import { APIMETA, CURIE } from './config';

export class BioEntity {
    private semanticType: string;
    private dbIDs: DBIdsObject;

    constructor(semanticType: string, dbIDs: DBIdsObject) {
        this.semanticType = semanticType;
        this.dbIDs = dbIDs
    }

    private getCurieFromVal(val: string, prefix: string): string {
        if (prefix in CURIE.ALWAYS_PREFIXED) {
            return val;
        }
        return prefix + ':' + val;
    }

    getPrimaryID(): string {
        const ranks = APIMETA[this.semanticType].id_ranks;
        for (const prefix of ranks) {
            if (prefix in this.dbIDs) {
                return this.getCurieFromVal(this.dbIDs[prefix][0], prefix);
            }
        }
        return undefined;
    }

    getLabel(): string {
        if ('SYMBOL' in this.dbIDs) {
            return this.dbIDs.SYMBOL[0];
        }
        if ('name' in this.dbIDs) {
            return this.dbIDs.name[0];
        }
        return this.getPrimaryID();
    }

    getCuries(): string[] {
        const res = [];
        for (const prefix in this.dbIDs) {
            for (const id of this.dbIDs[prefix]) {
                res.push(this.getCurieFromVal(id, prefix));
            }
        }
        return res;
    }
}