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
exports.VP = void 0;
const moment_1 = __importDefault(require("moment"));
const check_1 = require("./check");
/**
 * Trackback implementation for verifiable presentation
 * Creates, Validates and Issue JWTs for Verifiable Presentation.
 *
 * @remarks Please see {@link https://www.w3.org/TR/vc-data-model | W3C Verifiable Credentials data model}
 *
 * @public
 */
class VP {
    /**
     * Validate presentation. throw error if invalid
     * @param presentation presentation object or jwt
     */
    validate(presentation) {
        (0, check_1.checkPresentation)(presentation);
    }
    /**
     * Trackback implementation JSON Web Token
     *
     * @remarks Please see {@link https://www.w3.org/TR/vc-data-model/#json-web-token | 6.3.1 JSON Web Token}
     *
     * @param options {IJWTSignOptions} Parameter nessasary to create a JSON Web Token.
     * @returns Promise<string> jwt
     */
    issueJWT(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { keyPair } = options;
            if (!keyPair) {
                throw new TypeError(' keyPair required');
            }
            // run common credential checks
            const { presentation } = options;
            if (!presentation) {
                throw new TypeError('"presentation" parameter is required for issuing.');
            }
            this.validate(presentation);
            const privateKeyJwk = keyPair.getPrivateKeyJwk();
            if (!privateKeyJwk) {
                throw new TypeError('Private key required for issuing');
            }
            const header = {
                typ: 'JWT',
                alg: privateKeyJwk.alg,
                kid: keyPair.getId(),
            };
            const payload = Object.assign(Object.assign({ jti: presentation.id, nbf: (0, moment_1.default)().unix() }, options === null || options === void 0 ? void 0 : options.headers), { vp: Object.assign({}, presentation) });
            return keyPair.signer().sign(payload, { header });
        });
    }
    /**
     * verify jwt presentation
     *
     * @remarks Please see {@link https://www.w3.org/TR/vc-data-model/#json-web-token | 6.3.1 JSON Web Token}
     *
     * @param jwt jwt token
     * @param options {IJWTVerifyOptions} options for verifing jwt
     * @returns {Promise<boolean>}  A promise result
     */
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
            this.validate(payload.vp);
            return keyPair
                .verifier()
                .verify({ data: options.presentation, signature: jwt });
        });
    }
}
exports.VP = VP;
//# sourceMappingURL=index.js.map