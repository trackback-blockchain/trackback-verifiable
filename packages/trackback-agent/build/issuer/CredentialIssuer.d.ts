import { KeyPairOptions } from '@trackback/key';
import { ICredentialIssuer, IKeyPair, ICredential } from "../types";
/**
 * Trackback implementation for issuing credentials and presentations
 */
export declare class CredentialIssuer implements ICredentialIssuer {
    /**
     * Create Verifiable Credentials as JWT
     * @remarks Please see {@link https://www.w3.org/TR/vc-data-model/#json-web-token | 6.3.1 JSON Web Token}
     * @param cred - The credential
     * @param keyPair - The key pair
     * @returns jwt
     */
    createVerifiableCredentials(cred: ICredential, keyPair: IKeyPair): Promise<string>;
    /**
     * Create JWT payload of a JWT based verifiable presentation
     * @remarks Please see {@link https://www.w3.org/TR/vc-data-model/#example-31-jwt-payload-of-a-jwt-based-verifiable-presentation-non-normative | JWT payload of a JWT based verifiable presentation (non-normative)}
     * @param vcs - array of JWT
     * @param keyPair - JWT key pair
     * @returns jwt
     */
    createVerifiablePresentation(vcs: string[], keyPair: IKeyPair): Promise<string>;
    generateKeyPair(controller?: string, alg?: string, options?: KeyPairOptions): Promise<IKeyPair>;
}
//# sourceMappingURL=CredentialIssuer.d.ts.map