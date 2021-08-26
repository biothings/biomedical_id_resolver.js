import { IResolver, ResolverOutput, SRIResolverOutput, ResolverInput } from './common/types';
import BioLinkBasedResolver from './resolve/biolink_based_resolver';
import DefaultResolver from './resolve/default_resolver';
import { APIMETA } from './config';
import generateInvalid from './fake';
import { _resolveSRI } from './sri';

export class Resolver implements IResolver {
  private _resolver: IResolver;
  constructor(type: string = undefined) {
    this.setResolver(type);
  }

  private setResolver(type: string) {
    if (type === 'biolink') {
      this._resolver = new BioLinkBasedResolver();
    } else {
      this._resolver = new DefaultResolver();
    }
  }

  set resolver(type) {
    this.setResolver(type);
  }

  async resolve(userInput: ResolverInput): Promise<ResolverOutput> {
    return await this._resolver.resolve(userInput);
  }
}

export async function resolveSRI(userInput: ResolverInput): Promise<SRIResolverOutput> {
  return await _resolveSRI(userInput);
}

export const METADATA = APIMETA;
export function generateInvalidBioentities(input) {
  return generateInvalid(input);
}
