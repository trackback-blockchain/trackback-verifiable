import { Issuer } from './Issuer';

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
  proof?: any;
  [x: string]: any;
}

export type W3Credential = {
  '@context': string[];
  issuer: Issuer;
  type: string | string[];
  issuanceDate: string;
  credentialSubject: CredentialSubject;
  credentialStatus?: CredentialStatus;
  [x: string]: any;
};
