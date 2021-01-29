import { DBIdsObject } from './common/types';
import { APIMETA, CURIE } from './config';
import { getPrefixFromCurie, generateDBID } from './utils'

abstract class BioEntity {
    abstract get primaryID(): string

    abstract get label(): string

    abstract get curies(): string[]

    abstract get dbIDs(): DBIdsObject
}

export class ValidBioEntity extends BioEntity {
    private semanticType: string;
    private _dbIDs: DBIdsObject;

    constructor(semanticType: string, dbIDs: DBIdsObject) {
        super();
        this.semanticType = semanticType;
        this._dbIDs = dbIDs
    }

    private getCurieFromVal(val: string, prefix: string): string {
        if (prefix in CURIE.ALWAYS_PREFIXED) {
            return val;
        }
        return prefix + ':' + val;
    }

    get primaryID(): string {
        const ranks = APIMETA[this.semanticType].id_ranks;
        for (const prefix of ranks) {
            if (prefix in this._dbIDs) {
                return this.getCurieFromVal(this._dbIDs[prefix][0], prefix);
            }
        }
        return undefined;
    }

    get label(): string {
        if ('SYMBOL' in this._dbIDs) {
            return this._dbIDs.SYMBOL[0];
        }
        if ('name' in this._dbIDs) {
            return this._dbIDs.name[0];
        }
        return this.primaryID;
    }

    get curies(): string[] {
        const res = [];
        for (const prefix in this._dbIDs) {
            for (const id of this._dbIDs[prefix]) {
                res.push(this.getCurieFromVal(id, prefix));
            }
        }
        return res;
    }

    get dbIDs(): DBIdsObject {
        return this._dbIDs;
    }
}

export class InValidBioEntity extends BioEntity {
    private semanticType: string;
    private curie: string;
    constructor(semanticType: string, curie: string) {
        super();
        this.semanticType = semanticType;
        this.curie = curie;
    }

    get primaryID(): string {
        return this.curie;
    }

    get label(): string {
        return this.curie;
    }

    get curies(): string[] {
        return [this.curie];
    }

    get dbIDs(): DBIdsObject {
        return {
            [getPrefixFromCurie(this.curie)]: [generateDBID(this.curie)]
        }
    }
}