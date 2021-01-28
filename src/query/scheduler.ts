import _ from 'lodash';

import { BioThingsQueryBuilder } from './builder';
import { DBIdsObject, Buckets } from '../common/types'
import { MAX_CONCURRENT_QUERIES } from '../config';

export class Scheduler {

    private validInput: DBIdsObject
    private _buckets: Buckets;

    constructor(validInput: DBIdsObject) {
        this.validInput = validInput;
        this._buckets = {};
    }

    get buckets() {
        return this._buckets;
    }

    schedule() {
        Object.keys(this.validInput).map(semanticType => {
            const builder = new BioThingsQueryBuilder(semanticType, this.validInput[semanticType]);
            const promises = builder.build();
            promises.map((p, i) => {
                let bucketIndex = Math.floor(i / MAX_CONCURRENT_QUERIES);
                if (!(bucketIndex in this._buckets)) {
                    this._buckets[bucketIndex] = [];
                }
                this._buckets[bucketIndex].push(p);
            })
        });
        return this.buckets;
    }
}