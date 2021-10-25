import { ICredentialIssuer } from "../types/ICredentialIssuer";
import { ITrackBackContext } from "../types/ITrackBackContext";
import {
  ICredential,
  VerifiableCredential,
} from "../types/VerifiableCredential";
import { VerifiablePresentation } from "../types/VerifiablePresentation";

export class CredentialIssuer implements ICredentialIssuer {
  createVerifiableCredentials(
    cred: ICredential,
    context: ITrackBackContext
  ): Promise<VerifiableCredential> {
    throw new Error("Method not implemented.");
  }

  createVerifiablePresentation(
    vcs: VerifiableCredential[],
    context: ITrackBackContext
  ): Promise<VerifiablePresentation> {
    throw new Error("Method not implemented.");
  }
}
