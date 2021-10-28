import { IKeyPair, ITrackBackContext } from './../types';
export declare class CredentialVerifier {
    /**
     *  Verify w3 credentials as jwt
     * @param credentials - credentials as jwt
     * @param context - trackback context
     * @returns promise true/false
     */
    verifyCredentials(credentials: any, context: ITrackBackContext): Promise<boolean>;
    /**
     * Verify presentation for jwt
     * @param presentation - presentation jwt format
     * @param context - trackback context
     * @param keypair - key pair to verify presentation
     * @returns promise true/false
     */
    verifyPresentation(presentation: any, context: ITrackBackContext, keypair?: IKeyPair): Promise<boolean>;
}
//# sourceMappingURL=CredentialVerifier.d.ts.map