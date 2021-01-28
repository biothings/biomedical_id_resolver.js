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

export const Valid_Semantic_Types = ['Gene', 'SequenceVariant', 'ChemicalSubstance', 'Disease', 'DiseaseOrPhenotypicFeature', 'PhenotypicFeature', 'MolecularActivity', 'BiologicalProcess', 'CellularComponent', 'Pathway', 'AnatomicalEntity', 'Cell'] as const; // TS 3.4
type SuitValidSemanticTypes = typeof Valid_Semantic_Types; // readonly ['hearts', 'diamonds', 'spades', 'clubs']
export type ValidSemanticTypes = SuitValidSemanticTypes[number];

//export type ValidSemanticTypes = 'Gene' | 'SequenceVariant' | 'ChemicalSubstance' | 'Disease' | 'DiseaseOrPhenotypicFeature' | 'PhenotypicFeature' | 'MolecularActivity' | 'BiologicalProcess' | 'CellularComponent' | 'Pathway' | 'AnatomicalEntity' | 'Cell';

export enum ValidTypes {
    Gene = "Gene",
    SequenceVariant = "SequenceVariant",
    ChemicalSubstance = "ChemicalSubstance",
    Disease = "Disease",
    DiseaseOrPhenotypicFeature = "DiseaseOrPhenotypicFeature",
    PhenotypicFeature = "PhenotypicFeature",
    MolecularActivity = "MolecularActivity",
    BiologicalProcess = "BiologicalProcess",
    CellularComponent = "CellularComponent",
    Cell = "Cell",
    Pathway = "Pathway",
    AnatomicalEntity = "AnatomicalEntity"
}

export interface DBIdsObject {
    [prefix: string]: string[];
}

export type DBIdsObjectWithValidTypes = {
    [key in ValidSemanticTypes]: string[];
}

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
}

export interface ObjectWithStringKeyAndArrayValues {
    [key: string]: string[];
}

export interface DBIdsObjects {
    [key: string]: DBIdsObject;
}

export interface Buckets {
    [key: number]: any[];
}