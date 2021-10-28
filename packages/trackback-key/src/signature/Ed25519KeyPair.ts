import { randomBytes } from 'crypto';

import * as ed25519 from '@stablelib/ed25519';
import { Encoding } from '../encoding/Encoding';
import { CONTENT_TYPE_DID_LD_JSON } from '../constants';

import { Ed25519VerificationKey2018, IEd25519KeyPair } from '../types';

export class Ed25519KeyPair implements IEd25519KeyPair {
  public id: string;
  public controller: string;
  public publicKey: Uint8Array;
  public privateKey?: Uint8Array;

  constructor(options: {
    id: string;
    controller: string;
    publicKey: Uint8Array;
    privateKey?: Uint8Array;
  }) {
    this.id = options.id;
    this.controller = options.controller;
    this.publicKey = options.publicKey;
    this.privateKey = options.privateKey;
  }

  static async generate() {
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
  }

  static secureRandom = () => {
    return randomBytes(32);
  };

  static generateKeyfingerprint(publicKey: Uint8Array) {
    return Encoding.encodeED25519Key(publicKey, '');
  }

  //reference:- https://w3c-ccg.github.io/lds-ed25519-2018/#examples
  exportAsEd25519VerificationKey2018(): Ed25519VerificationKey2018 {
    const exprtKey: Ed25519VerificationKey2018 = {
      id: this.id,
      type: 'Ed25519VerificationKey2018',
      controller: this.controller,
      publicKeyBase58: Encoding.base58BTC(this.publicKey),
    };

    if (this.privateKey) {
      exprtKey.privateKeyBase58 = Encoding.base58BTC(this.privateKey);
    }

    return exprtKey;
  }

  /**
   *
   * @param publicKey
   * @param contentType
   * @returns
   */
  static toDIDDocument(publicKey: Uint8Array, contentType: string) {
    const fingerprint = Encoding.encodeED25519Key(publicKey, 'base58btc');
    const did = `did:key:${fingerprint}`;

    const keyId = `${did}#${fingerprint}`;

    const x25519PubicKey = ed25519.convertPublicKeyToX25519(publicKey);
    const x25519Key = `${did}#${Encoding.encodeED25519Key(
      x25519PubicKey,
      'base58btc'
    )}`;

    const context: { [key: string]: any } = {};
    if (contentType === CONTENT_TYPE_DID_LD_JSON) {
      context['@context'] = 'https://w3id.org/did/v1';
    }
    // refeence:- https://w3c-ccg.github.io/ld-cryptosuite-registry/#signature-suites
    return {
      ...context,
      id: did,
      verificationMethod: [
        {
          id: keyId,
          type: 'Ed25519VerificationKey2018',
          controller: did,
          publicKeyBase58: fingerprint,
        },
      ],
      authentication: [keyId],
      assertionMethod: [keyId],
      capabilityDelegation: [keyId],
      capabilityInvocation: [keyId],
      keyAgreement: [
        {
          id: x25519Key,
          type: 'X25519KeyAgreementKey2019',
          controller: did,
          publicKeyBase58: Encoding.toBase58btc(x25519PubicKey),
        },
      ],
    };
  }
}
