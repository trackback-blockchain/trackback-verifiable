import { DIDResolutionResult, DIDResolutionOptions } from './types';
import { DID_FORMAT } from './helpers';

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

const emptyResult: DIDResolutionResult = {
  didResolutionMetadata: {},
  didDocument: null,
  didDocumentMetadata: {},
};

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
   * find did method from did uri
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
