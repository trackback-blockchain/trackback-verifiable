"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Ed25519KeyPair = void 0;
const crypto_1 = require("crypto");
const ed25519 = __importStar(require("@stablelib/ed25519"));
const Encoding_1 = require("../encoding/Encoding");
const constants_1 = require("../constants");
class Ed25519KeyPair {
    constructor(options) {
        this.id = options.id;
        this.controller = options.controller;
        this.publicKey = options.publicKey;
        this.privateKey = options.privateKey;
    }
    static generate() {
        return __awaiter(this, void 0, void 0, function* () {
            const key = ed25519.generateKeyPair();
            const fingerprint = this.generateKeyfingerprint(key.publicKey);
            const controller = `did:key:${fingerprint}`;
            const id = `${controller}#${fingerprint}`;
            return new Ed25519KeyPair({
                id,
                controller,
                publicKey: key.publicKey,
                privateKey: key.secretKey,
            });
        });
    }
    static generateKeyfingerprint(publicKey) {
        return Encoding_1.Encoding.encodeED25519Key(publicKey, '');
    }
    //https://w3c-ccg.github.io/lds-ed25519-2018/#examples
    exportAsEd25519VerificationKey2018() {
        const exprtKey = {
            id: this.id,
            type: 'Ed25519VerificationKey2018',
            controller: this.controller,
            publicKeyBase58: Encoding_1.Encoding.base58BTC(this.publicKey),
        };
        if (this.privateKey) {
            exprtKey.privateKeyBase58 = Encoding_1.Encoding.base58BTC(this.privateKey);
        }
        return exprtKey;
    }
    /**
     *
     * @param publicKey
     * @param contentType
     * @returns
     */
    static toDIDDocument(publicKey, contentType) {
        const fingerprint = Encoding_1.Encoding.encodeED25519Key(publicKey, 'base58btc');
        const did = `did:key:${fingerprint}`;
        const keyId = `${did}#${fingerprint}`;
        const x25519PubicKey = ed25519.convertPublicKeyToX25519(publicKey);
        const x25519Key = `${did}#${Encoding_1.Encoding.encodeED25519Key(x25519PubicKey, 'base58btc')}`;
        const context = {};
        if (contentType === constants_1.CONTENT_TYPE_DID_LD_JSON) {
            context['@context'] = 'https://w3id.org/did/v1';
        }
        // info https://w3c-ccg.github.io/ld-cryptosuite-registry/#signature-suites
        return Object.assign(Object.assign({}, context), { id: did, verificationMethod: [
                {
                    id: keyId,
                    type: 'Ed25519VerificationKey2018',
                    controller: did,
                    publicKeyBase58: fingerprint,
                },
            ], authentication: [keyId], assertionMethod: [keyId], capabilityDelegation: [keyId], capabilityInvocation: [keyId], keyAgreement: [
                {
                    id: x25519Key,
                    type: 'X25519KeyAgreementKey2019',
                    controller: did,
                    publicKeyBase58: Encoding_1.Encoding.toBase58btc(x25519PubicKey),
                },
            ] });
    }
}
exports.Ed25519KeyPair = Ed25519KeyPair;
Ed25519KeyPair.secureRandom = () => {
    return (0, crypto_1.randomBytes)(32);
};
//# sourceMappingURL=Ed25519KeyPair.js.map