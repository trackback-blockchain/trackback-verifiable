import * as u8a from 'uint8arrays'

export class Encoding {

  static base64Encode(buffer: string | Buffer | Uint8Array): string {
    return Buffer.from(buffer).toString("base64").replace(/=+$/g, '');
  }

  static base64Decode(st: string): string {
    return Buffer.from(st, "base64").toString("utf8");
  }

  static base58BTC(key: Uint8Array) {
    return u8a.toString(key, 'base58btc')
  }

  /**
   * Convert public key to mulibase key
   * @param {Uint8Array} publicKey public key arry
   * @param {string} encoding encoding type must be one of base58btc, base64url
   * @returns {string} encoded public key
   */
  static encodeED25519Key(publicKey: Uint8Array, encoding: string): string {
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

    throw new Error('Encoding not supported: ' + encoding)
  }

  static toBase58btc(publicKey: Uint8Array): string {
    return u8a.toString(publicKey, 'base58btc')
  }
  // https://medium.com/swlh/json-web-signature-jws-and-jws-detached-for-a-five-year-old-88729b7b1a68
  static toBase64url(data: any): string {
    return Buffer
      .from(data || '')
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
  }

  static fromBase64Url(data: string): string {
    const fixed = data.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = Buffer.from(fixed, 'base64').toString('utf8');
    return decoded;
  }

}