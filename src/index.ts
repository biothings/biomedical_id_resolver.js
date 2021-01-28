import { DBIdsObject, DBIdsObjects } from './common/types';
import { Scheduler } from './query/scheduler';
import { Validator } from './validate';
import { BioEntity, InValidBioEntity } from './bioentity';
import { getPrefixFromCurie } from './utils'

export = class IDResolver {
    constructor() {

    }

    private annotateInvalidInput(invalidInput: DBIdsObject) {
        const res = {};
        for (const semanticType in invalidInput) {
            for (const curie of invalidInput[semanticType]) {
                res[curie] = new InValidBioEntity(semanticType, curie)
            }
        }
        return res;
    }

    private annotateValidButNotRetrievedFromAPIResults(validInput: DBIdsObject, resultFromAPI: DBIdsObjects) {
        const res = {};
        for (const semanticType in validInput) {
            for (const curie of validInput[semanticType]) {
                if (!(curie in resultFromAPI)) {
                    res[curie] = new InValidBioEntity(semanticType, curie)
                }
            }
        }
        return res;
    }

    async resolve(userInput: any) {
        const validator = new Validator(userInput);
        validator.validate();
        const scheduler = new Scheduler(validator.valid);
        scheduler.schedule();
        let result = {};
        for (let index = 0; index < Object.values(scheduler.buckets).length; index++) {
            const promises = Object.values(scheduler.buckets)[index];
            let res = await Promise.allSettled(promises) as any;
            res.map(item => {
                if (item.status === "fulfilled") {
                    result = { ...result, ...item.value }
                }
            })
        }
        result = { ...result, ...this.annotateValidButNotRetrievedFromAPIResults(validator.valid, result) };
        result = { ...result, ...this.annotateInvalidInput(validator.invalid) };
        return result;
    }
}