import { DIDResolutionResult } from './types';
import { DID_FORMAT } from './helpers';


export type DIDResolutionOptions = {};

export interface DIDResolver {
  resolve: (
    did: string,
    options: DIDResolutionOptions
  ) => Promise<DIDResolutionResult>;
}

export interface ResolverMap {
  [key: string]: DIDResolver;
}

export type ParsedResult = {
  prefix: string;
};

const emptyResult: DIDResolutionResult = {
  didResolutionMetadata: {},
  didDocument: null,
  didDocumentMetadata: {},
};

export default class DIDUtilily {
  private _resolverMap: ResolverMap;

  constructor(method?: string, resolver?: DIDResolver) {
    this._resolverMap = {};
    if (method && resolver) {
      this.add(method, resolver);
    }
  }

  add(method: string, resolver: DIDResolver): void {
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

      const resolver: DIDResolver = this._resolverMap[parse.prefix];

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
