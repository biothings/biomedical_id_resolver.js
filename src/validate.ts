import _ from 'lodash';
import InvalidIDResolverInputError from './common/exceptions';
import { DBIdsObject } from './common/types';
import { APIMETA } from './config';
import { getPrefixFromCurie } from './utils';


export class Validator {
    private userInput: any;
    private _invalid: DBIdsObject;
    private _valid: DBIdsObject;

    constructor(userInput: any) {
        this.userInput = userInput;
        this._invalid = {};
        this._valid = {} as DBIdsObject;
    }

    get invalid(): DBIdsObject {
        return this._invalid;
    }

    get valid(): DBIdsObject {
        return this._valid;
    }

    private validateIfInputIsObject(userInput = this.userInput) {
        if (!(_.isPlainObject(userInput))) {
            throw new InvalidIDResolverInputError("Your Input to ID Resolver is Invalid. It should be a plain object!")
        };
    }

    private validateIfValuesOfInputIsArray(userInput = this.userInput) {
        for (const vals of Object.values(userInput)) {
            if (!(Array.isArray(vals))) {
                throw new InvalidIDResolverInputError("Your Input to ID Resolver is Invalid. All values of your input dictionary should be a list!")
            }
        }
    }

    private validateIfEachItemInInputValuesIsCurie(userInput: DBIdsObject = this.userInput) {
        for (const vals of Object.values(userInput)) {
            for (const item of vals) {
                if (!(typeof item === "string") || !(item.includes(":"))) {
                    throw new InvalidIDResolverInputError(`Your Input to ID Resolver is Invalid. Each item in the values of your input dictionary should be a curie. Spotted ${item} is not a curie`)
                }
            }
        }
    }

    private checkIfSemanticTypeCanBeResolved(userInput: DBIdsObject) {
        const DBIDsWithCorrectSemanticTypes = {} as DBIdsObject;
        for (const semanticType in userInput) {
            if (Object.keys(APIMETA).includes(semanticType)) {
                DBIDsWithCorrectSemanticTypes[semanticType] = userInput[semanticType]
            } else {
                this._invalid[semanticType] = userInput[semanticType];

            }
        }
        return DBIDsWithCorrectSemanticTypes;
    }

    private checkIfPrefixCanBeResolved(userInput: DBIdsObject) {
        for (const semanticType in userInput) {
            for (const item of userInput[semanticType]) {
                if (!(getPrefixFromCurie(item) in APIMETA[semanticType]['mapping'])) {
                    if (!(semanticType in this._invalid)) {
                        this._invalid[semanticType] = [];
                    }
                    this._invalid[semanticType].push(item);
                } else {
                    if (!(semanticType in this._valid)) {
                        this._valid[semanticType] = [];
                    }
                    this._valid[semanticType].push(item);
                }
            }
        }
    }

    validate(): void {
        this.validateIfInputIsObject(this.userInput);
        this.validateIfValuesOfInputIsArray(this.userInput);
        this.validateIfEachItemInInputValuesIsCurie(this.userInput);
        const tmpValidRes = this.checkIfSemanticTypeCanBeResolved(this.userInput);
        this.checkIfPrefixCanBeResolved(tmpValidRes)
    }
}