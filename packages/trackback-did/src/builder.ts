import { DIDDocument } from '.';
import { ServiceEndpoint, VerificationMethod } from './types';


export class Builder {
  id!: string;
  controller!: string | string[];
  alsoKnownAs!: string[];
  verificationMethod!: VerificationMethod[];
  service!: ServiceEndpoint[];
  authentication!: (string | VerificationMethod)[];
  assertionMethod!: (string | VerificationMethod)[];
  keyAgreement!: (string | VerificationMethod)[];
  capabilityInvocation!: (string | VerificationMethod)[];
  capabilityDelegation!: (string | VerificationMethod)[];
  private context!: string | string[];

  setContext(context: string | string[]) {
    this.context = context;
    return this;
  }

  setId(id: string) {
    this.id = id;
    return this;
  }

  setController(controller: string | string[]) {
    this.controller = controller;
    return this;
  }

  setAlsoKnownAs(alsoKnownAs: string[]) {
    this.alsoKnownAs = alsoKnownAs;
    return this;
  }

  setVerificationMethod(verificationMethod: VerificationMethod[]) {
    this.verificationMethod = verificationMethod;
    return this;
  }
  setService(service: ServiceEndpoint[]) {
    this.service = service;
    return this;
  }

  setAuthentication(authentication?: (string | VerificationMethod)[]) {
    this.authentication = authentication!;
    return this;
  }

  setAssertionMethod(assertionMethod?: (string | VerificationMethod)[]) {
    this.assertionMethod = assertionMethod!;
    return this;
  }

  setKeyAgreement(keyAgreement?: (string | VerificationMethod)[]) {
    this.keyAgreement = keyAgreement!;
    return this;
  }
  setCapabilityInvocation(
    capabilityInvocation?: (string | VerificationMethod)[]
  ) {
    this.capabilityInvocation = capabilityInvocation!;
    return this;
  }
  setCapabilityDelegation(
    capabilityDelegation?: (string | VerificationMethod)[]
  ) {
    this.capabilityDelegation = capabilityDelegation!;
    return this;
  }

  build(): DIDDocument {
    if (!this.id) {
      throw new Error('id required');
    }

    if (this.id.split(':')[0] !== 'did') {
      throw new Error('did: prefix required');
    }

    const didDoc: DIDDocument = {
      id: this.id,
    };

    if (this.controller) {
      didDoc.controller = this.controller;
    }
    if (this.alsoKnownAs) {
      didDoc.alsoKnownAs = this.alsoKnownAs;
    }
    if (this.verificationMethod) {
      didDoc.verificationMethod = this.verificationMethod;
    }
    if (this.service) {
      didDoc.service = this.service;
    }
    if (this.authentication) {
      didDoc.authentication = this.authentication;
    }
    if (this.keyAgreement) {
      didDoc.keyAgreement = this.keyAgreement;
    }
    if (this.capabilityInvocation) {
      didDoc.capabilityInvocation = this.capabilityInvocation;
    }
    if (this.capabilityDelegation) {
      didDoc.capabilityDelegation = this.capabilityDelegation;
    }

    if (this.context) {
      didDoc['@context'] = this.context;
    }

    return didDoc;
  }

  toJSON(): string {
    return JSON.stringify(this.build());
  }

  toJSONLD(): string {
    if (this.context) {
      this.context = ['https://www.w3.org/ns/did/v1'];
    }
    return JSON.stringify(this.build());
  }
}
