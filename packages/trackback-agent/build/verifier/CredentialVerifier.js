"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialVerifier = void 0;
const key_1 = require("@trackback/key");
const vc_1 = require("@trackback/vc");
function decodeJWT(jwt) {
    const [encodedHeader, encodedPayload] = jwt.split('.');
    const header = JSON.parse(Buffer.from(encodedHeader, 'base64').toString());
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64').toString());
    return {
        header,
        payload,
    };
}
function resolveKeyPair(issuer, context) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield ((_a = context === null || context === void 0 ? void 0 : context.agent) === null || _a === void 0 ? void 0 : _a.procedure.resolve(issuer));
        if (!result || !result.didDocument) {
            throw new Error('issuer not resolvable');
        }
        const verificationMethod = result.didDocument.verificationMethod;
        const supportedKey = (verificationMethod || []).find(v => v.type === 'JsonWebKey2020');
        return key_1.JsonWebKey2020.import(supportedKey);
    });
}
class CredentialVerifier {
    /**
     *  Verify w3 credentials as jwt
     * @param credentials - credentials as jwt
     * @param context - trackback context
     * @returns promise true/false
     */
    verifyCredentials(credentials, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const vc = new vc_1.VC();
            if (typeof credentials === 'string') {
                const { header, payload } = decodeJWT(credentials);
                if (!header.alg) {
                    throw new Error('alg is required in JWT header');
                }
                if (!payload.vc) {
                    throw new Error('vp property is required in JWT');
                }
                const issuer = payload.iss;
                if (!issuer) {
                    throw new Error('issuer is required to verify signature');
                }
                let keyPair;
                if (issuer) {
                    keyPair = yield resolveKeyPair(issuer, context);
                }
                if (!keyPair) {
                    throw new Error('keyPair not resolvable');
                }
                return vc.verify(credentials, {
                    keyPair,
                    credential: payload
                });
            }
            throw new Error('only jwt verification is supported');
        });
    }
    /**
     * Verify presentation for jwt
     * @param presentation - presentation jwt format
     * @param context - trackback context
     * @param keypair - key pair to verify presentation
     * @returns promise true/false
     */
    verifyPresentation(presentation, context, keypair) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof presentation === 'string') {
                const { header, payload } = decodeJWT(presentation);
                if (!header.alg) {
                    throw new Error('alg is required in JWT header');
                }
                if (!payload.vp) {
                    throw new Error('vp property is required in JWT');
                }
                const issuer = payload.iss;
                if (issuer && context && !keypair) {
                    keypair = yield resolveKeyPair(issuer, context);
                }
                if (!keypair) {
                    throw new Error('could not resolve verificationMethod.');
                }
                const vp = new vc_1.VP();
                vp.validate(payload.vp);
                const r = yield vp.verify(presentation, {
                    keyPair: keypair,
                    presentation: payload.vp
                });
                if (!r) {
                    return false;
                }
                const credentials = payload.vp.verifiableCredential;
                const credentialsPromises = credentials.map((c) => this.verifyCredentials(c, context));
                const status = yield Promise.all(credentialsPromises);
                return status.reduce((a, b) => a && b, true);
            }
            throw new Error('only jwt verification is supported');
        });
    }
}
exports.CredentialVerifier = CredentialVerifier;
//# sourceMappingURL=CredentialVerifier.js.map