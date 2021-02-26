import { APIMETA } from '../config';

interface ResolverOutputIDObject {
  identifier: string;
  label: string;
}

export interface ResolverOutputDBIDsObject {
  [prefix: string]: (string | number)[];
}

export interface ResolverSingleOutputObject {
  id: ResolverOutputIDObject;
  curies: string[];
  db_ids: ResolverOutputDBIDsObject;
  type: string;
  flag?: string;
}

export interface ResolverOutputObject {
  [curie: string]: ResolverSingleOutputObject;
}

export interface BioThingsAPIQueryResponse {
  query: string;
  [fieldName: string]: any;
}

export interface BioThingsAPIFailedQueryResponse extends BioThingsAPIQueryResponse {
  notfound: true;
}

export type ResolvableSemanticTypes =
  | 'Gene'
  | 'SequenceVariant'
  | 'ChemicalSubstance'
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
  SequenceVariant = 'SequenceVariant',
  ChemicalSubstance = 'ChemicalSubstance',
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

export interface ResolverInputObject {
  [semanticType: string]: (string | number)[];
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
  [key: string]: DBIdsObjects
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
  classTree: BioLink["classTree"]
}

export interface BioLinkEntityObject {
  parent: string;
  children: string[];
  description: string;
  id_prefixes: string[];
  name: string;
  addChild(child: string): void;
}