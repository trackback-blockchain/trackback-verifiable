"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Builder = void 0;
class Builder {
    setContext(context) {
        this.context = context;
        return this;
    }
    setId(id) {
        this.id = id;
        return this;
    }
    setController(controller) {
        this.controller = controller;
        return this;
    }
    setAlsoKnownAs(alsoKnownAs) {
        this.alsoKnownAs = alsoKnownAs;
        return this;
    }
    setVerificationMethod(verificationMethod) {
        this.verificationMethod = verificationMethod;
        return this;
    }
    setService(service) {
        this.service = service;
        return this;
    }
    setAuthentication(authentication) {
        this.authentication = authentication;
        return this;
    }
    setAssertionMethod(assertionMethod) {
        this.assertionMethod = assertionMethod;
        return this;
    }
    setKeyAgreement(keyAgreement) {
        this.keyAgreement = keyAgreement;
        return this;
    }
    setCapabilityInvocation(capabilityInvocation) {
        this.capabilityInvocation = capabilityInvocation;
        return this;
    }
    setCapabilityDelegation(capabilityDelegation) {
        this.capabilityDelegation = capabilityDelegation;
        return this;
    }
    build() {
        if (!this.id) {
            throw new Error('id required');
        }
        if (this.id.split(':')[0] !== 'did') {
            throw new Error('did: prefix required');
        }
        const didDoc = {
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
    toJSON() {
        return JSON.stringify(this.build());
    }
    toJSONLD() {
        if (this.context) {
            this.context = ['https://www.w3.org/ns/did/v1'];
        }
        return JSON.stringify(this.build());
    }
}
exports.Builder = Builder;
//# sourceMappingURL=builder.js.map