import { VerifiableCredential } from "./VerifiableCredential";

export interface IPresentation {
  "@context": string[];
  id?: string;
  holder: string;
  issuanceDate?: string;
  expirationDate?: string;
  type: string[];
  verifier: string[];
  verifiableCredential?: VerifiableCredential[];
  [x: string]: any;
}

export interface VerifiablePresentation {
  "@context": string[];
  id?: string;
  holder: string;
  issuanceDate?: string;
  expirationDate?: string;
  type: string[];
  verifier: string[];
  verifiableCredential?: VerifiableCredential[];
  proof: {
    type?: string;
    [x: string]: any;
  };
  [x: string]: any;
}
