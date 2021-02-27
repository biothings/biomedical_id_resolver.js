import { IResolver, ResolverOutput } from '../common/types';

export default abstract class BaseResolver implements IResolver {
    abstract resolve(usrInput: unknown): Promise<ResolverOutput>
}