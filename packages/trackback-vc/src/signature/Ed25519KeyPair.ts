import { createHash, randomBytes } from 'crypto';

import { CompactSign } from 'jose/jws/compact/sign'
import * as ed25519 from '@stablelib/ed25519';
import { Encoding } from '../encoding/Encoding';
import { CONTENT_TYPE_DID_LD_JSON } from '../constants';

export class Ed25519KeyPair {
    public id: string;
    public controller: string;
    public publicKey: Uint8Array;
    public privateKey?: Uint8Array;

    constructor(options: { id: string, controller: string, publicKey: Uint8Array, privateKey?: Uint8Array }) {
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

        })
    }

    static secureRandom = () => {
        return randomBytes(32);
    };


    static generateKeyfingerprint(publicKey: Uint8Array) {
        return Encoding.encodeED25519Key(publicKey, '')
    }


    async sign(keyPair: Ed25519KeyPair, data: string) {

        if (typeof data !== 'string') {
            throw new Error('string required');
        }

        if (!keyPair.privateKey) {
            throw new Error('No private key');
        }

        const encoder = new TextEncoder();
        const digest = this.digest(data);

        const jws = await new CompactSign(encoder.encode(digest))
            .setProtectedHeader({ alg: 'ES256' })
            .sign(keyPair.privateKey)

        console.log(jws)

        return jws;
    }


    digest(data: string) {
        return createHash('sha256').update(data).digest('base64');
    }


    verify() {
        throw new Error('Not yet implemented')
    }

/**
 * 
 * @param publicKey 
 * @param contentType 
 * @returns 
 */
    static toDIDDocument(publicKey: Uint8Array, contentType: string) {
        const fingerprint = Encoding.encodeED25519Key(publicKey, 'base58btc')
        const did = `did:key:${fingerprint}`;

        const keyId = `${did}#${fingerprint}`;

        const x25519PubicKey = ed25519.convertPublicKeyToX25519(publicKey)
        const x25519Key = `${did}#${Encoding.encodeED25519Key(x25519PubicKey, 'base58btc')}`

        const context: { [key: string]: any } = {}
        if (contentType === CONTENT_TYPE_DID_LD_JSON) {
            context['@context'] = 'https://w3id.org/did/v1'
        }
        // info https://w3c-ccg.github.io/ld-cryptosuite-registry/#signature-suites
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
        }

    }

}