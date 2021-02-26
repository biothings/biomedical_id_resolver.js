import { DBIdsObject, DBIdsObjects } from './common/types';
import { Scheduler } from './query/scheduler';
import { DefaultResolvableator } from './validate/default_validator';
import { IrresolvableBioEntity } from './bioentity/irresolvable_bioentity';
import Debug from 'debug';
const debug = Debug('biomedical-id-resolver:Main');

export = class IDResolver {
  private annotateIrresolvableInput(IrresolvableInput: DBIdsObject, resultFromAPI: DBIdsObjects) {
    const res = {};
    let cnt = 0;
    Object.keys(IrresolvableInput).map((semanticType) => {
      for (const curie of IrresolvableInput[semanticType]) {
        if (!(curie in resultFromAPI)) {
          res[curie] = new IrresolvableBioEntity(semanticType, curie);
          cnt += 1;
        }
      }
    });
    debug(`Total number of Irresolvable curies are: ${cnt}`);
    return res;
  }

  private annotateResolvableButNotRetrievedFromAPIResults(validInput: DBIdsObject, resultFromAPI: DBIdsObjects) {
    const res = {};
    let cnt = 0;
    Object.keys(validInput).map((semanticType) => {
      for (const curie of validInput[semanticType]) {
        if (!(curie in resultFromAPI)) {
          res[curie] = new IrresolvableBioEntity(semanticType, curie);
          cnt += 1;
        }
      }
    });
    debug(`Total number of valid curies but are unable to be resolved are ${cnt}`);
    return res;
  }

  async resolve(userInput: unknown) {
    const validator = new DefaultResolvableator(userInput);
    validator.validate();
    const scheduler = new Scheduler(validator.valid);
    scheduler.schedule();
    let result = {};
    for (const promises of Object.values(scheduler.buckets)) {
      const res = (await Promise.allSettled(promises)) as any;
      res.map((item) => {
        if (item.status === 'fulfilled') {
          result = { ...result, ...item.value };
        } else {
          debug(`One API Query fails, reason is ${item.reason}`);
        }
      });
    }
    debug(`Total number of curies that are successfully resolved are: ${Object.keys(result).length}`);
    result = { ...result, ...this.annotateResolvableButNotRetrievedFromAPIResults(validator.valid, result) };
    result = { ...result, ...this.annotateIrresolvableInput(validator.irresolvable, result) };
    debug(`Total number of results returned are: ${Object.keys(result).length}`);
    return result;
  }

  generateIrresolvableBioentities(userInput: any) {
    const validator = new DefaultResolvableator(userInput);
    validator.validate();
    const result = this.annotateIrresolvableInput(validator.valid, {});
    return result;
  }
};
