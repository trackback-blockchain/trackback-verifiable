
import { Issuer } from "./Issuer";

export type Type = string | string[];


export interface Credential {
  id?: string
  [key: string]: any;
}

export interface CredentialStatus {
  id?: string
  [key: string]: any;
}

export type CredentialSubject = Credential | [Credential]

export interface VerifiableCredential {
  context: string[];
  issuer: Issuer;
  type: string | string[];
  issuanceDate: string;
  credentialSubject: CredentialSubject
  credentialStatus?: CredentialStatus
  proof?: any;
  [x: string]: any;
}
