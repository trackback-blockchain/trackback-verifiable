import { AbstractJsonWebKey } from '@trackback/key';
/**
 * Presenation JWT sign options
 * @public
 */
export interface IJWTSignOptions {
    /**
     * Implementation of JsonWebKey2020
     */
    keyPair: AbstractJsonWebKey;
    /**
     * presenation
     *
     */
    presentation: any;
    /**
     * aditional headers to include in jwt
     */
    headers?: any;
}
/**
 * Presenation JWT verify options
 * @public
 */
export interface IJWTVerifyOptions {
    /**
     * Implementation of JsonWebKey2020
     */
    keyPair: AbstractJsonWebKey;
    /**
     * presenation
     *
     */
    presentation: any;
}
/**
 * Trackback implementation for verifiable presentation
 * Creates, Validates and Issue JWTs for Verifiable Presentation.
 *
 * @remarks Please see {@link https://www.w3.org/TR/vc-data-model | W3C Verifiable Credentials data model}
 *
 * @public
 */
export declare class VP {
    /**
     * Validate presentation. throw error if invalid
     * @param presentation presentation object or jwt
     */
    validate(presentation: any): void;
    /**
     * Trackback implementation JSON Web Token
     *
     * @remarks Please see {@link https://www.w3.org/TR/vc-data-model/#json-web-token | 6.3.1 JSON Web Token}
     *
     * @param options {IJWTSignOptions} Parameter nessasary to create a JSON Web Token.
     * @returns Promise<string> jwt
     */
    issueJWT(options: IJWTSignOptions): Promise<string>;
    /**
     * verify jwt presentation
     *
     * @remarks Please see {@link https://www.w3.org/TR/vc-data-model/#json-web-token | 6.3.1 JSON Web Token}
     *
     * @param jwt jwt token
     * @param options {IJWTVerifyOptions} options for verifing jwt
     * @returns {Promise<boolean>}  A promise result
     */
    verifyJWT(jwt: string, options: IJWTVerifyOptions): Promise<boolean>;
}
//# sourceMappingURL=index.d.ts.map