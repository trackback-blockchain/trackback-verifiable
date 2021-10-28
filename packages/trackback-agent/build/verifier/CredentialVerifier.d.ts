import { IKeyPair, ITrackBackContext } from './../types';
export declare class CredentialVerifier {
    verifyCredentials(credentials: any, context: ITrackBackContext): Promise<boolean>;
    verifyPresentation(presentation: any, context: ITrackBackContext, keypair?: IKeyPair): Promise<boolean>;
}
//# sourceMappingURL=CredentialVerifier.d.ts.map