"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialIssuer = void 0;
const key_1 = require("@trackback/key");
const vc_1 = require("@trackback/vc");
/**
 * Trackback implementation for issuing credentials and presentations
 */
class CredentialIssuer {
    /**
     * Create Verifiable Credentials as JWT
     * @remarks Please see {@link https://www.w3.org/TR/vc-data-model/#json-web-token | 6.3.1 JSON Web Token}
     * @param cred - The credential
     * @param keyPair - The key pair
     * @returns jwt
     */
    createVerifiableCredentials(cred, keyPair) {
        if (!cred)
            throw new Error("Credentials required");
        if (!keyPair)
            throw new Error("keyPair required");
        const vc = new vc_1.VC();
        return vc.issueJWT({ keyPair, credential: cred });
    }
    /**
     * Create JWT payload of a JWT based verifiable presentation
     * @remarks Please see {@link https://www.w3.org/TR/vc-data-model/#example-31-jwt-payload-of-a-jwt-based-verifiable-presentation-non-normative | JWT payload of a JWT based verifiable presentation (non-normative)}
     * @param vcs - array of JWT
     * @param keyPair - JWT key pair
     * @returns jwt
     */
    createVerifiablePresentation(vcs, keyPair) {
        if (!vcs || vcs.length === 0)
            throw new Error("One or more VerifiableCredentials required");
        if (!keyPair)
            throw new Error("keyPair required");
        const presentation = {
            '@context': ['https://www.w3.org/2018/credentials/v1'],
            type: ['VerifiablePresentation'],
            verifiableCredential: [
                ...vcs
            ],
        };
        const vp = new vc_1.VP();
        return vp.issueJWT({ keyPair, presentation });
    }
    generateKeyPair(controller, alg, options) {
        return key_1.JsonWebKey2020.generate(controller, alg, options);
    }
}
exports.CredentialIssuer = CredentialIssuer;
//# sourceMappingURL=CredentialIssuer.js.map