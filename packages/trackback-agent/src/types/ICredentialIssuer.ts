import { ITrackBackContext } from "./ITrackBackContext";
import { ICredential, VerifiableCredential } from "./VerifiableCredential";
import { VerifiablePresentation } from "./VerifiablePresentation";

export interface ICredentialIssuer {
  createVerifiableCredentials(
    cred: ICredential,
    context: ITrackBackContext
  ): Promise<VerifiableCredential>;

  createVerifiablePresentation(
    vcs: VerifiableCredential[],
    context: ITrackBackContext
  ): Promise<VerifiablePresentation>;
}
