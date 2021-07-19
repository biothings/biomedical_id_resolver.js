export interface BioThingsAPIQueryResponse {
  query: string;
  [fieldName: string]: any;
}

export interface GrpedBioThingsAPIQueryResponse {
  [query: string]: BioThingsAPIQueryResponse[];
}

export interface BioThingsAPIFailedQueryResponse extends BioThingsAPIQueryResponse {
  notfound: true;
}

export type ResolvableSemanticTypes =
  | 'Gene'
  | 'Transcript'
  | 'Protein'
  | 'SequenceVariant'
  | 'ChemicalSubstance'
  | 'Drug'
  | 'Disease'
  | 'DiseaseOrPhenotypicFeature'
  | 'PhenotypicFeature'
  | 'MolecularActivity'
  | 'BiologicalProcess'
  | 'CellularComponent'
  | 'Pathway'
  | 'AnatomicalEntity'
  | 'Cell';

export enum ResolvableTypes {
  Gene = 'Gene',
  Transcript = 'Transcript',
  Protein = 'Protein',
  SequenceVariant = 'SequenceVariant',
  ChemicalSubstance = 'ChemicalSubstance',
  Drug = 'Drug',
  Disease = 'Disease',
  DiseaseOrPhenotypicFeature = 'DiseaseOrPhenotypicFeature',
  PhenotypicFeature = 'PhenotypicFeature',
  MolecularActivity = 'MolecularActivity',
  BiologicalProcess = 'BiologicalProcess',
  CellularComponent = 'CellularComponent',
  Cell = 'Cell',
  Pathway = 'Pathway',
  AnatomicalEntity = 'AnatomicalEntity',
}

export interface DBIdsObject {
  [prefix: string]: string[];
}

export type DBIdsObjectWithResolvableTypes = {
  [key in ResolvableSemanticTypes]: string[];
};

export interface TmpGrpedIDObject {
  [prefix: string]: (string | number)[];
}

export interface TmpGrpedResultObject {
  [curie: string]: TmpGrpedIDObject;
}

export interface APIFieldMappingObject {
  [prefix: string]: string[];
}

export interface MetaDataObject {
  id_ranks: string[];
  semantic: string;
  api_name: string;
  url: string;
  mapping: APIFieldMappingObject;
  additional_attributes_mapping?: APIFieldMappingObject;
}

export type MetaDataItemsObject = {
  [key: string]: MetaDataObject;
};

export interface ObjectWithStringKeyAndArrayValues {
  [key: string]: string[];
}

export interface DBIdsObjects {
  [key: string]: DBIdsObject;
}

export interface GroupedDBIDsObjects {
  [key: string]: DBIdsObjects;
}

export interface Buckets {
  [key: number]: any[];
}

export interface PromiseAllSettledOutput {
  status: string;
  [key: string]: any;
}

import { BioLink } from 'biolink-model';

export interface BioLinkHandlerClass {
  classTree: BioLink['classTree'];
}

export interface BioLinkEntityObject {
  parent: string;
  children: string[];
  description: string;
  id_prefixes: string[];
  name: string;
  addChild(child: string): void;
}

export interface ValidatorObject {
  resolvable: DBIdsObject;
  irresolvable: DBIdsObject;
  validate(): void;
}

export interface BioLinkBasedValidatorObject extends ValidatorObject {
  valid: DBIdsObject;
}

export interface IBioEntity {
  semanticTypes: string[];
  semanticType: string;
  primaryID: string;
  label: string;
  curies: string[];
  dbIDs: DBIdsObject;
  attributes: DBIdsObject;
}

export interface IndividualResolverOutput {
  [semanticType: string]: IBioEntity;
}

export interface ResolverOutput {
  [curie: string]: IBioEntity[];
}

export interface IResolver {
  resolve(userInput: unknown): Promise<ResolverOutput>;
}
