import { DBIdsObject } from '../common/types';

export abstract class BioEntity {
    abstract get primaryID(): string

    abstract get label(): string

    abstract get curies(): string[]

    abstract get dbIDs(): DBIdsObject
}