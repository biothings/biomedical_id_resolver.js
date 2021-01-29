import { DBIdsObject, DBIdsObjects } from './common/types';
import { Scheduler } from './query/scheduler';
import { Validator } from './validate';
import { InValidBioEntity } from './bioentity';
import Debug from 'debug';
const debug = Debug("biomedical-id-resolver:Main");


export = class IDResolver {

    private annotateInvalidInput(invalidInput: DBIdsObject) {
        const res = {};
        let cnt = 0;
        for (const semanticType in invalidInput) {
            for (const curie of invalidInput[semanticType]) {
                res[curie] = new InValidBioEntity(semanticType, curie);
                cnt += 1;
            }
        }
        debug(`Total number of invalid curies are: ${cnt}`);
        return res;
    }

    private annotateValidButNotRetrievedFromAPIResults(validInput: DBIdsObject, resultFromAPI: DBIdsObjects) {
        const res = {};
        let cnt = 0;
        for (const semanticType in validInput) {
            for (const curie of validInput[semanticType]) {
                if (!(curie in resultFromAPI)) {
                    res[curie] = new InValidBioEntity(semanticType, curie);
                    cnt += 1;
                }
            }
        }
        debug(`Total number of valid curies but are unable to be resolved are ${cnt}`);
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
                } else {
                    debug(`One API Query fails, reason is ${item.reason}`)
                }
            })
        }
        debug(`Total number of curies that are successfully resolved are: ${Object.keys(result).length}`)
        result = { ...result, ...this.annotateValidButNotRetrievedFromAPIResults(validator.valid, result) };
        result = { ...result, ...this.annotateInvalidInput(validator.invalid) };
        debug(`Total number of results returned are: ${Object.keys(result).length}`)
        return result;
    }
}