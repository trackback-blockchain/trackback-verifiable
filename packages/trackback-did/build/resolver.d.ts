import { DIDResolutionResult, DIDResolutionOptions } from './types';
export interface IDIDResolver {
    resolve: (did: string, options: DIDResolutionOptions) => Promise<DIDResolutionResult>;
}
export interface ResolverMap {
    [key: string]: IDIDResolver;
}
export declare type ParsedResult = {
    prefix: string;
};
export default class DIDResolver {
    private _resolverMap;
    constructor(method?: string, resolver?: IDIDResolver);
    add(method: string, resolver: IDIDResolver): void;
    resolve(did: string, options?: DIDResolutionOptions): Promise<DIDResolutionResult>;
    /**
     * find did method from did uri
     * @param {string} did  DID uri.
     *
     * @returns {{prefix: string}} Returns the did method
     */
    parseDID(did: string): ParsedResult;
}
//# sourceMappingURL=resolver.d.ts.map