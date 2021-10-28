/// <reference types="node" />
/**
 * Encoding | Decoding functionality provided by TrackBack
 */
export declare class Encoding {
    /**
     * Base64Encode
     * @param buffer string |Buffer|Uint8Array
     * @returns string
     */
    static base64Encode(buffer: string | Buffer | Uint8Array): string;
    /**
     * Base64Decode
     * @param st string
     * @returns string
     */
    static base64Decode(st: string): string;
    /**
     * Base58BTC
     * Reference :- https://en.bitcoin.it/wiki/Base58Check_encoding
     * @param key Uint8Array | reference :- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
     * @returns
     */
    static base58BTC(key: Uint8Array): string;
    /**
     * Convert public key to mulibase key
     * @param {Uint8Array} publicKey public key arry
     * @param {string} encoding encoding type must be one of base58btc, base64url
     * @returns {string} encoded public key
     */
    static encodeED25519Key(publicKey: Uint8Array, encoding: string): string;
    static toBase58btc(publicKey: Uint8Array): string;
    static toBase64url(data: any): string;
    static decodeBase64Url(data: string): string;
}
//# sourceMappingURL=Encoding.d.ts.map