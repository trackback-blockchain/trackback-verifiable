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
exports.JsonWebKey2020 = void 0;
const types_1 = require("./types");
const verify_1 = require("jose/jws/flattened/verify");
const generate_key_pair_1 = require("jose/util/generate_key_pair");
const export_1 = require("jose/key/export");
const import_1 = require("jose/key/import");
const thumbprint_1 = require("jose/jwk/thumbprint");
const sign_1 = require("jose/jws/flattened/sign");
const Encoding_1 = require("./encoding/Encoding");
// based on https://github.com/w3c-ccg/lds-jws2020
// https://github.com/w3c-ccg/lds-jws2020
// not all alg is supported
const DEFAULT_ALG = 'EdDSA';
const DEFAULT_CRV_LENGTH = { crv: 'Ed25519' };
/**
 * check header has deattached params
 * @param encodedHeader
 * @returns
 */
function isDeattachedHeader(encodedHeader) {
    try {
        const header = JSON.parse(Encoding_1.Encoding.base64Decode(encodedHeader));
        return (header === null || header === void 0 ? void 0 : header.b64) === false && header.crit[0] === 'b64';
    }
    catch (error) {
        console.log(error);
    }
    return false;
}
class JsonWebKey2020 extends types_1.AbstractJsonWebKey {
    constructor(option) {
        super();
        this.id = option.id;
        this.type = option.type;
        this.controller = option.controller;
        this.publicKeyJwk = option.publicKeyJwk;
        this.privateKeyJwk = option.privateKeyJwk;
    }
    static generate(controller, alg, options) {
        return __awaiter(this, void 0, void 0, function* () {
            alg = alg || DEFAULT_ALG;
            const { publicKey, privateKey } = yield (0, generate_key_pair_1.generateKeyPair)(alg, options || DEFAULT_CRV_LENGTH);
            const privateKeyJwk = yield (0, export_1.exportJWK)(privateKey);
            const publicKeyJwk = yield (0, export_1.exportJWK)(publicKey);
            const thumbprint = yield (0, thumbprint_1.calculateThumbprint)(publicKeyJwk);
            const _controller = controller || `did:trackback:key:${thumbprint}`;
            if (!privateKeyJwk.alg) {
                privateKeyJwk.alg = alg;
            }
            if (!publicKeyJwk.alg) {
                publicKeyJwk.alg = alg;
            }
            const id = `${_controller}#${thumbprint}`;
            return new JsonWebKey2020({
                id,
                type: 'JsonWebKey2020',
                controller: _controller,
                publicKeyJwk,
                privateKeyJwk,
            });
        });
    }
    getId() {
        return this.id;
    }
    getController() {
        return this.controller;
    }
    getPublicKey() {
        return this.publicKeyJwk;
    }
    getPrivateKey() {
        return this.privateKeyJwk;
    }
    static from(keyPair) {
        return new JsonWebKey2020(Object.assign({}, keyPair));
    }
    static fingerprint(publicKeyJwk) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, thumbprint_1.calculateThumbprint)(publicKeyJwk);
        });
    }
    signer() {
        if (!this.privateKeyJwk) {
            return {
                sign() {
                    return __awaiter(this, void 0, void 0, function* () {
                        throw new Error('No private key');
                    });
                },
            };
        }
        const _this = this;
        return {
            sign(data, options) {
                return __awaiter(this, void 0, void 0, function* () {
                    return _this.sign(data, options);
                });
            },
        };
    }
    sign(data, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const deattachedHeaders = {
                b64: false,
                crit: ['b64'],
            };
            const _header = Object.assign(Object.assign({ alg: (_a = this.privateKeyJwk) === null || _a === void 0 ? void 0 : _a.alg }, ((options === null || options === void 0 ? void 0 : options.deattached) ? deattachedHeaders : undefined)), options === null || options === void 0 ? void 0 : options.header);
            const flattenedJWS = yield this._sign(data, _header);
            return (flattenedJWS.protected +
                '.' +
                flattenedJWS.payload +
                '.' +
                flattenedJWS.signature);
        });
    }
    _sign(data, header) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.privateKeyJwk) {
                throw new Error('No private key');
            }
            if (!this.privateKeyJwk.alg && !header.alg) {
                throw new Error('TypeError: "alg" argument is required when "jwk.alg" is not present');
            }
            const encoder = new TextEncoder();
            const payloadToSign = typeof data === 'string' ? data : JSON.stringify(data);
            return new sign_1.FlattenedSign(encoder.encode(payloadToSign))
                .setProtectedHeader(header)
                .sign(yield (0, import_1.importJWK)(this.privateKeyJwk, header.alg));
        });
    }
    verifier() {
        if (!this.publicKeyJwk) {
            return {
                verify({ data, signature }) {
                    throw new Error('Public key required');
                },
            };
        }
        const _this = this;
        return {
            verify({ data, signature }) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        const [encodedHeader, payloadEncoded, sig] = signature.split('.');
                        const isDeattached = isDeattachedHeader(encodedHeader);
                        const payloadToSign = typeof data === 'string' ? data : JSON.stringify(data);
                        const jws = {
                            signature: sig,
                            payload: isDeattached ? payloadToSign : payloadEncoded,
                            protected: encodedHeader,
                        };
                        const result = yield (0, verify_1.flattenedVerify)(jws, yield (0, import_1.importJWK)(_this.publicKeyJwk));
                        return Boolean(result);
                    }
                    catch (error) {
                        console.log(error);
                    }
                    return false;
                });
            },
        };
    }
    toDIDDocument(didUri) {
        if (!this.publicKeyJwk) {
            throw new Error('Public key required');
        }
        const keyWithoutPk = new JsonWebKey2020(Object.assign({}, this));
        if (didUri) {
            keyWithoutPk.id = keyWithoutPk.id.replace(keyWithoutPk.controller, didUri);
            keyWithoutPk.controller = didUri;
        }
        // remove private key 
        delete keyWithoutPk.privateKeyJwk;
        return {
            '@context': "https://www.w3.org/ns/did/v1",
            id: didUri || this.controller,
            publicKey: [
                Object.assign({}, keyWithoutPk)
            ],
            "authentication": [
                keyWithoutPk.id
            ],
            "assertionMethod": [
                keyWithoutPk.id
            ],
            "capabilityDelegation": [
                keyWithoutPk.id
            ],
            "capabilityInvocation": [
                keyWithoutPk.id
            ]
        };
    }
}
exports.JsonWebKey2020 = JsonWebKey2020;
//# sourceMappingURL=JsonWebKey2020.js.map