export declare type AnyType = Record<string, any>;
export interface JSONWebKey {
    kty: string;
    use: string;
    key_ops: string;
    alg: string;
    kid: string;
    x5u: string;
}
/**
 * Abstract definition for verification method
 */
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
    '@context'?: string | string[];
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
export interface DIDResolutionOptions extends AnyType {
    accept?: string;
}
export interface DIDResolutionMetadata extends AnyType {
    contentType?: string;
    error?: 'invalidDid' | 'notFound' | 'representationNotSupported' | string;
}
export interface DIDDocumentMetadata extends AnyType {
    created?: string;
    updated?: string;
    deactivated?: boolean;
    versionId?: string;
    nextUpdate?: string;
    nextVersionId?: string;
    equivalentId?: string;
    canonicalId?: string;
}
export interface DIDResolutionResult {
    didResolutionMetadata: DIDResolutionMetadata;
    didDocument: DIDDocument | null;
    didDocumentMetadata: DIDDocumentMetadata;
}
export interface IDIDManager {
}
//# sourceMappingURL=types.d.ts.map