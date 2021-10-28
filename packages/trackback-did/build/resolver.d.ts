import { DIDResolutionResult, DIDResolutionOptions } from './types';
/**
 * Abstract implementation for `DIDResolver`
 */
export interface IDIDResolver {
    resolve: (did: string, options: DIDResolutionOptions) => Promise<DIDResolutionResult>;
}
export interface ResolverMap {
    [key: string]: IDIDResolver;
}
export declare type ParsedResult = {
    prefix: string;
};
/**
 * DIDResolver
 * Returns a DID Document with metadata
 */
export default class DIDResolver {
    private _resolverMap;
    constructor(method?: string, resolver?: IDIDResolver);
    add(method: string, resolver: IDIDResolver): void;
    /**
     *
     * @param did DIDURI should follow the format defined in :- https://www.w3.org/TR/did-core/#a-simple-example
     * @param options DID Resolution options
     * @returns Promise<DIDResolutionResult>
     */
    resolve(did: string, options?: DIDResolutionOptions): Promise<DIDResolutionResult>;
    /**
     * find DID method from DID uri
     * @param {string} did  DID uri.
     *
     * @returns {{prefix: string}} Returns the did method
     */
    parseDID(did: string): ParsedResult;
}
//# sourceMappingURL=resolver.d.ts.map