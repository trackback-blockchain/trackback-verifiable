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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Encoding = void 0;
const u8a = __importStar(require("uint8arrays"));
class Encoding {
    static base64Encode(buffer) {
        return Buffer.from(buffer).toString('base64').replace(/=+$/g, '');
    }
    static base64Decode(st) {
        return Buffer.from(st, 'base64').toString('utf8');
    }
    static base58BTC(key) {
        return u8a.toString(key, 'base58btc');
    }
    /**
     * Convert public key to mulibase key
     * @param {Uint8Array} publicKey public key arry
     * @param {string} encoding encoding type must be one of base58btc, base64url
     * @returns {string} encoded public key
     */
    static encodeED25519Key(publicKey, encoding) {
        if (!encoding) {
            throw new Error('encoding required');
        }
        const buffer = new Uint8Array(2 + publicKey.length);
        buffer[0] = 0xec;
        buffer[1] = 0x01;
        buffer.set(publicKey, 2);
        if (encoding === 'base58btc') {
            return `z${u8a.toString(publicKey, 'base58btc')}`;
        }
        if (encoding === 'base64url') {
            return `u${u8a.toString(publicKey, 'base64url')}`;
        }
        throw new Error('Encoding not supported: ' + encoding);
    }
    static toBase58btc(publicKey) {
        return u8a.toString(publicKey, 'base64url');
    }
}
exports.Encoding = Encoding;
//# sourceMappingURL=Encoding.js.map