import { DIDResolutionResult, DIDResolutionOptions } from './types';
import { DID_FORMAT } from './helpers';

/**
 * Abstract implementation for `DIDResolver`
 */
export interface IDIDResolver {
  resolve: (
    did: string,
    options: DIDResolutionOptions
  ) => Promise<DIDResolutionResult>;
}

export interface ResolverMap {
  [key: string]: IDIDResolver;
}

export type ParsedResult = {
  prefix: string;
};

/**
 * Default results for `DIDResolutionResult`
 */
const emptyResult: DIDResolutionResult = {
  didResolutionMetadata: {},
  didDocument: null,
  didDocumentMetadata: {},
};

/**
 * DIDResolver
 * Returns a DID Document with metadata
 */
export default class DIDResolver {
  private _resolverMap: ResolverMap;

  constructor(method?: string, resolver?: IDIDResolver) {
    this._resolverMap = {};
    if (method && resolver) {
      this.add(method, resolver);
    }
  }

  add(method: string, resolver: IDIDResolver): void {
    const map = {
      [method]: resolver,
    };
    Object.assign(this._resolverMap, map);
  }

  /**
   * 
   * @param did DIDURI should follow the format defined in :- https://www.w3.org/TR/did-core/#a-simple-example
   * @param options DID Resolution options
   * @returns Promise<DIDResolutionResult>
   */
  async resolve(
    did: string,
    options: DIDResolutionOptions = {}
  ): Promise<DIDResolutionResult> {
    try {
      const parse = this.parseDID(did);

      const resolver: IDIDResolver = this._resolverMap[parse.prefix];

      const didDocumentResult = await resolver.resolve(did, options);

      return {
        didResolutionMetadata: didDocumentResult.didResolutionMetadata,
        didDocument: didDocumentResult.didDocument,
        didDocumentMetadata: didDocumentResult.didDocumentMetadata,
      };
    } catch (error) {
      return {
        ...emptyResult,
      };
    }
  }

  /**
   * find DID method from DID uri
   * @param {string} did  DID uri.
   *
   * @returns {{prefix: string}} Returns the did method
   */
  parseDID(did: string): ParsedResult {
    if (!did) {
      throw new TypeError('DID cannot be empty.');
    }

    if (!DID_FORMAT.test(did)) {
      throw new TypeError('Not a valid did format');
    }

    const prefix = did.split(':').slice(1, 2).join(':');

    return { prefix };
  }
}
