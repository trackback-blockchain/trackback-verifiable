import { IKeyPair } from '@trackback/key';
import { W3Credential } from './../types/VerifiableCredential';
/**
 * Trackback implementation for verifiable credential
 * Creates, Validates and Issue JWTs for Verifiable credential.
 *
 * @remarks Please see {@link https://www.w3.org/TR/vc-data-model | W3C Verifiable Credentials data model}
 *
 * @public
 */
export declare class VC {
    validate(credential?: W3Credential | any): boolean;
    /**
     * This specification introduces two new registered claim names,
     * which contain those parts of the standard verifiable credentials and verifiable presentations
     * where no explicit encoding rules for JWT exist
     * @param options
     */
    issue(options: {
        keyPair: IKeyPair;
        credential: W3Credential;
    }): Promise<string>;
    verify(jwt: string, options: {
        keyPair: IKeyPair;
        credential: W3Credential;
    }): Promise<boolean>;
}
//# sourceMappingURL=vc.d.ts.map