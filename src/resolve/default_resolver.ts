import BaseResolver from './base_resolver';
import { DBIdsObject, ResolverOutput, IndividualResolverOutput } from '../common/types';
import query from '../query/index';
import { DefaultValidator } from '../validate/default_validator';
import { IrresolvableBioEntity } from '../bioentity/irresolvable_bioentity';
import Debug from 'debug';
const debug = Debug('biomedical-id-resolver:Main');

export default class DefaultResolver extends BaseResolver {

    private annotateUnresolvedInputs(unresolvedInputs: DBIdsObject, currentResult: ResolverOutput): ResolverOutput {
        Object.keys(unresolvedInputs).map((semanticType) => {
            for (const curie of unresolvedInputs[semanticType]) {
                if (!(curie in currentResult)) {
                    currentResult[curie] = {};
                }
                if (!(semanticType in currentResult[curie])) {
                    currentResult[curie][semanticType] = new IrresolvableBioEntity(semanticType, curie);
                }
            }
        });
        debug(`Total number of Irresolvable curies are: ${Object.keys(unresolvedInputs).length}`);
        return currentResult;
    }

    private organizeResolvedOutputs(resolved: IndividualResolverOutput[]): ResolverOutput {
        const result = {};
        resolved.map(recs => {
            for (const curie of Object.keys(recs)) {
                if (!(curie in result)) {
                    result[curie] = {};
                }
                result[curie][recs[curie].semanticType] = recs[curie];
            }
        })
        return result;
    }

    async resolve(userInput: unknown): Promise<ResolverOutput> {
        const validator = new DefaultValidator(userInput);
        validator.validate();
        const queryResult = await query(validator.resolvable);
        let result = this.organizeResolvedOutputs(queryResult);
        result = this.annotateUnresolvedInputs(validator.resolvable, result);
        result = this.annotateUnresolvedInputs(validator.irresolvable, result);
        debug(`Total number of results returned are: ${Object.keys(result).length}`);
        return result;
    }
}