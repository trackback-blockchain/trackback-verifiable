import { DIDDocument } from '.';
import { ServiceEndpoint, VerificationMethod } from './types';
export declare class Builder {
    id: string;
    controller: string | string[];
    alsoKnownAs: string[];
    verificationMethod: VerificationMethod[];
    service: ServiceEndpoint[];
    authentication: (string | VerificationMethod)[];
    assertionMethod: (string | VerificationMethod)[];
    keyAgreement: (string | VerificationMethod)[];
    capabilityInvocation: (string | VerificationMethod)[];
    capabilityDelegation: (string | VerificationMethod)[];
    private context;
    setContext(context: string | string[]): this;
    setId(id: string): this;
    setController(controller: string | string[]): this;
    setAlsoKnownAs(alsoKnownAs: string[]): this;
    setVerificationMethod(verificationMethod: VerificationMethod[]): this;
    setService(service: ServiceEndpoint[]): this;
    setAuthentication(authentication?: (string | VerificationMethod)[]): this;
    setAssertionMethod(assertionMethod?: (string | VerificationMethod)[]): this;
    setKeyAgreement(keyAgreement?: (string | VerificationMethod)[]): this;
    setCapabilityInvocation(capabilityInvocation?: (string | VerificationMethod)[]): this;
    setCapabilityDelegation(capabilityDelegation?: (string | VerificationMethod)[]): this;
    build(): DIDDocument;
    toJSON(): string;
    toJSONLD(): string;
}
//# sourceMappingURL=builder.d.ts.map