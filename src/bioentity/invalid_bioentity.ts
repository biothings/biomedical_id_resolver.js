import { DBIdsObject } from '../common/types';
import { getPrefixFromCurie, generateDBID } from '../utils';
import { BioEntity } from './base_bioentity';

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
      [getPrefixFromCurie(this.curie)]: [generateDBID(this.curie)],
    };
  }
}
