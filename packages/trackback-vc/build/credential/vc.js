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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VC = void 0;
const moment_1 = __importDefault(require("moment"));
const check_1 = require("./check");
/**
 * Trackback implementation for verifiable credential
 * Creates, Validates and Issue JWTs for Verifiable credential.
 *
 * @remarks Please see {@link https://www.w3.org/TR/vc-data-model | W3C Verifiable Credentials data model}
 *
 * @public
 */
class VC {
    validate(credential) {
        return (0, check_1.check)(credential);
    }
    /**
     * This specification introduces two new registered claim names,
     * which contain those parts of the standard verifiable credentials and verifiable presentations
     * where no explicit encoding rules for JWT exist
     * @param options
     */
    // based on https://www.w3.org/TR/vc-data-model/#jwt-and-jws-considerations
    issueJWT(options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { keyPair } = options;
            if (!keyPair) {
                throw new TypeError(' keyPair required');
            }
            // run common credential checks
            const { credential } = options;
            if (!credential) {
                throw new TypeError('"credential" parameter is required for issuing.');
            }
            const issuer = typeof credential.issuer === 'string'
                ? credential.issuer
                : (_a = credential === null || credential === void 0 ? void 0 : credential.issuer) === null || _a === void 0 ? void 0 : _a.id;
            if (!issuer || typeof issuer === 'undefined') {
                throw new Error('credential issuer required');
            }
            let sub = Array.isArray(credential.credentialSubject)
                ? credential.credentialSubject[0].id
                : credential.credentialSubject.id;
            (0, check_1.check)(credential);
            const privateKeyJwk = keyPair.getPrivateKeyJwk();
            if (!privateKeyJwk) {
                throw new TypeError('Private key required for issuing');
            }
            const header = {
                typ: 'JWT',
                alg: privateKeyJwk.alg,
                kid: keyPair.getId(),
            };
            const payload = {
                sub: sub,
                jti: sub,
                iss: issuer,
                nbf: (0, moment_1.default)(credential.issuanceDate).unix(),
                vc: Object.assign({}, credential),
            };
            return keyPair.signer().sign(payload, { header });
        });
    }
    verifyJWT(jwt, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { keyPair } = options;
            if (!keyPair) {
                throw new TypeError(' keyPair required');
            }
            const publicKeyJwk = keyPair.getPublicKeyJwk();
            if (!publicKeyJwk) {
                throw new TypeError('public key required for verifing');
            }
            const [encodedHeader, encodedPayload] = jwt.split('.');
            const header = JSON.parse(Buffer.from(encodedHeader, 'base64').toString());
            const payload = JSON.parse(Buffer.from(encodedPayload, 'base64').toString());
            if (!header.alg) {
                throw new Error('alg is required in JWT header');
            }
            const credential = payload.vc;
            (0, check_1.check)(credential);
            return keyPair
                .verifier()
                .verify({ data: options.credential, signature: jwt });
        });
    }
}
exports.VC = VC;
//# sourceMappingURL=vc.js.map