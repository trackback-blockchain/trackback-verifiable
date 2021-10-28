import { KeyPairOptions } from '@trackback/key';
import { CredentialBuilder } from '@trackback/vc';
import { ICredentialIssuer, IKeyPair, ICredential, ITrackBackContext, DIDDocument } from "../types";
/**
 * Trackback implementation for issuing credentials and presentations
 */
export declare class CredentialIssuer implements ICredentialIssuer {
    credentialBuilder: CredentialBuilder;
    id: string;
    keypair: IKeyPair;
    constructor(options?: any);
    static build(options?: any): Promise<CredentialIssuer>;
    getIssuer(): string;
    /**
     * Save Issuer did document
     * @param context - ITrackBackContext
     * @returns json didDocument
     */
    save(context: ITrackBackContext): Promise<DIDDocument>;
    /**
     * create did document for this issuer
     * @returns json didDocument
     */
    toDidDocument(): DIDDocument;
    /**
     * Create Verifiable Credentials as JWT
     *
     * @remarks Please see {@link https://www.w3.org/TR/vc-data-model/#json-web-token | 6.3.1 JSON Web Token}
     * @param cred - The credential
     * @param keyPair - optional key pair
     * @returns jwt
     */
    createVerifiableCredentials(cred: ICredential, keyPair?: IKeyPair): Promise<string>;
    /**
     * Create JWT payload of a JWT based verifiable presentation
     * @remarks Please see {@link https://www.w3.org/TR/vc-data-model/#example-31-jwt-payload-of-a-jwt-based-verifiable-presentation-non-normative | JWT payload of a JWT based verifiable presentation (non-normative)}
     * @param vcs - array of JWT
     * @param keyPair - JWT key pair
     * @returns jwt
     */
    createVerifiablePresentation(vcs: string[], keyPair: IKeyPair): Promise<string>;
    /**
     * Generate IKeyPair
     * @param controller - did uri of the controller
     * @param alg - algorithm key
     * @param options -
     * @returns
     */
    generateKeyPair(controller?: string, alg?: string, options?: KeyPairOptions): Promise<IKeyPair>;
    /**
     * import IKeyPair from object
     * @param keyPair - json IKeyPair type
     * @returns IKeyPair
     */
    import(keyPair: any): IKeyPair;
}
//# sourceMappingURL=CredentialIssuer.d.ts.map