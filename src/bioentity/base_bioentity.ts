import { DBIdsObject, IBioEntity } from '../common/types';

export abstract class BioEntity implements IBioEntity {
  abstract get semanticType(): string;

  abstract get primaryID(): string;

  abstract get label(): string;

  abstract get curies(): string[];

  abstract get dbIDs(): DBIdsObject;
}
