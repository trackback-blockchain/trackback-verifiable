export declare type AnyType = Record<string, any>;
export interface JSONWebKey {
    kty: string;
    use: string;
    key_ops: string;
    alg: string;
    kid: string;
    x5u: string;
}
export interface VerificationMethod {
    id: string;
    controller: string;
    type: string;
    publicKeyJwk?: JSONWebKey;
    publicKeyMultibase?: string;
}
export interface ServiceEndpoint {
    id: string;
    type: string;
    serviceEndpoint: string;
}
export interface DIDDocument {
    "@context"?: string | string[];
    id: string;
    alsoKnownAs?: string[];
    controller?: string | string[];
    verificationMethod?: VerificationMethod[];
    service?: ServiceEndpoint[];
    authentication?: (string | VerificationMethod)[];
    assertionMethod?: (string | VerificationMethod)[];
    keyAgreement?: (string | VerificationMethod)[];
    capabilityInvocation?: (string | VerificationMethod)[];
    capabilityDelegation?: (string | VerificationMethod)[];
}
//# sourceMappingURL=did.d.ts.map