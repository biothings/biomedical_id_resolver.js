export default class SRIResolverFailiure extends Error {

  constructor(message = 'SRI Resolver Failed.', ...params) {
    super(...params);
    
    Object.setPrototypeOf(this, SRIResolverFailiure.prototype);
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SRIResolverFailiure);
    }

    this.name = 'SRIResolverFailiure';
    this.message = message;
  }
}