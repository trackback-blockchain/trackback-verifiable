import { IKeyPair } from './IKeyPair';
import { ICredential } from "./VerifiableCredential";


/**
 * Trackback implementation for issuing credentials and presentations interface
 */
export interface ICredentialIssuer {
  createVerifiableCredentials(
    cred: ICredential,
    keyPair?: IKeyPair
    ): Promise<string> 

  createVerifiablePresentation(
    vcs: string[],
    keyPair?: IKeyPair
  ): Promise<string>;
}
