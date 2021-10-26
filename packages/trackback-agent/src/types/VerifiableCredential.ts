import { Issuer } from './Issuer';

export interface ICredential {
  '@context': string[];
  issuer: Issuer;
  type: string | string[];
  issuanceDate: string;
  credentialSubject: CredentialSubject;
  credentialStatus?: CredentialStatus;
  [x: string]: any;
 
}


export type Type = string | string[];

export interface Claim {
  id?: string;
  [key: string]: any;
}

export interface CredentialStatus {
  id?: string;
  [key: string]: any;
}

export type CredentialSubject = Claim | [Claim];

export interface VerifiableCredential {
  '@context': string[];
  issuer: Issuer;
  type: string | string[];
  issuanceDate: string;
  credentialSubject: CredentialSubject;
  credentialStatus?: CredentialStatus;
  proof?: {
    type?: string;
    [x: string]: any;
  };
  [x: string]: any;
}
