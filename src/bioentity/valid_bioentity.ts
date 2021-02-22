import { DBIdsObject } from '../common/types';
import { APIMETA, CURIE } from '../config';
import { BioEntity } from './base_bioentity';

export class ValidBioEntity extends BioEntity {
  private _semanticType: string;
  private _dbIDs: DBIdsObject;

  constructor(semanticType: string, dbIDs: DBIdsObject) {
    super();
    this._semanticType = semanticType;
    this._dbIDs = dbIDs;
  }

  private getCurieFromVal(val: string, prefix: string): string {
    if (CURIE.ALWAYS_PREFIXED.includes(prefix)) {
      return val;
    }
    return prefix + ':' + val;
  }

  get semanticType(): string {
    return this._semanticType;
  }

  get primaryID(): string {
    const ranks = APIMETA[this._semanticType].id_ranks;
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
    Object.keys(this._dbIDs).map((prefix) => {
      for (const id of this._dbIDs[prefix]) {
        res.push(this.getCurieFromVal(id, prefix));
      }
    });
    return res;
  }

  get dbIDs(): DBIdsObject {
    return this._dbIDs;
  }
}
