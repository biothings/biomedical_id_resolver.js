export = class InvalidIDResolverInputError extends Error {
  constructor(message: string) {
    super(message);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, InvalidIDResolverInputError.prototype);
  }
};
