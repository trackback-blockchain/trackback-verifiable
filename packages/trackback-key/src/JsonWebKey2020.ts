
import { generateKeyPair, GenerateKeyPairOptions } from 'jose/util/generate_key_pair'
import { exportJWK } from 'jose/key/export'
import { importJWK } from 'jose/key/import'
import type { FlattenedJWS, JWK } from 'jose/types';
import { calculateThumbprint } from 'jose/jwk/thumbprint'
import { FlattenedSign } from 'jose/jws/flattened/sign'
import { Encoding } from './encoding/Encoding';
import { flattenedVerify } from 'jose/jws/flattened/verify'


// based on https://github.com/w3c-ccg/lds-jws2020
// https://github.com/w3c-ccg/lds-jws2020
// not all alg is supported

export class JsonWebKey2020 {
    public id: string;
    public type: string;
    public controller: string;
    public publicKeyJwk: JWK;
    public privateKeyJwk?: JWK;


    constructor(option: { id: string, type: string, controller: string, publicKeyJwk: JWK, privateKeyJwk?: JWK }) {
        this.id = option.id;
        this.type = option.type;
        this.controller = option.controller;
        this.publicKeyJwk = option.publicKeyJwk;
        this.privateKeyJwk = option.privateKeyJwk;
    }

    static async generate(controller?: string, alg?: string, options?: GenerateKeyPairOptions): Promise<JsonWebKey2020> {
        const ALG = 'EdDSA';

        const { publicKey, privateKey } = await generateKeyPair(alg || ALG, options || { crv: 'Ed25519' });

        const privateKeyJwk: JWK = await exportJWK(privateKey);
        const publicKeyJwk: JWK = await exportJWK(publicKey);
        const thumbprint = await calculateThumbprint(publicKeyJwk);
        const _controller = controller || `did:trackback:key:${thumbprint}`;

        if(!privateKeyJwk.alg){
            privateKeyJwk.alg = alg;
        }
        if(!publicKeyJwk.alg){
            publicKeyJwk.alg = alg;
        }

        const id = `${_controller}#${thumbprint}`

        return new JsonWebKey2020({
            id,
            type: "JsonWebKey2020",
            controller: _controller,
            publicKeyJwk,
            privateKeyJwk
        }

        )
    }

    get getId(): string {
        return this.id;
    }

    get getController(): string {
        return this.controller;
    }

    get getPublicKeyJwk(): JWK {
        return this.publicKeyJwk;
    }

    static from(keyPair: any) {
        return new JsonWebKey2020({
            ...keyPair
        })
    }

    static async fingerprint(publicKeyJwk: JWK) {
        return calculateThumbprint(publicKeyJwk);
    }

    signer() {
        if (!this.privateKeyJwk) {
            return {
                async sign() {
                    throw new Error('No private key');
                },
            };
        }

        const _this = this;

        return {
            async sign(data: any, header?: any) {
                return _this.sign(data, header);
            }
        }

    }

    async sign(data: any, header?: any): Promise<string> {
        const _header = {
            alg: 'EdDSA',
            b64: false,
            crit: ['b64'],
            ...header,
        }

        const flattenedJWS = await this._sign(data, _header);
        return flattenedJWS.protected + '.' + flattenedJWS.payload + '.' + flattenedJWS.signature
    }

    private async _sign(data: string, header: any): Promise<FlattenedJWS> {

        if (!this.privateKeyJwk) {
            throw new Error('No private key');
        }

        if (!this.privateKeyJwk.alg && !header.alg) {
            throw new Error('TypeError: "alg" argument is required when "jwk.alg" is not present')
        }

        const encoder = new TextEncoder();

        const payloadToSign = typeof data === 'string' ? data : JSON.stringify(data);

        return new FlattenedSign(encoder.encode(payloadToSign))
            .setProtectedHeader(header)
            .sign(await importJWK(this.privateKeyJwk, header.alg));
    }


    async signDeattached(data: string): Promise<string> {
        const header = {
            alg: 'EdDSA',
            b64: false,
            crit: ['b64'],
        }
        const flattenedJWS = await this._sign(data, header);

        return flattenedJWS.protected + '..' + flattenedJWS.signature
    }


    async verifyDeattached(jws: string, data: string): Promise<boolean> {

        const [encodedHeader, encodedSignature] = jws.split('..');
        let header;

        try {
            header = JSON.parse(Encoding.decodeBase64Url(encodedHeader));
        } catch (e) {
            throw new Error('Invalid header' + e);
        }

        if (header.alg !== this.publicKeyJwk.alg) {
            throw new Error('Invalid alg')
        }
        const encoder = new TextEncoder();
        const decoder = new TextDecoder()

        const detachedJWS = {
            protected: encodedHeader,
            payload: encoder.encode(data),
            signature: encodedSignature,
        };

        try {
            const { payload, protectedHeader } = await flattenedVerify(detachedJWS, await importJWK(this.publicKeyJwk))
            console.log(decoder.decode(payload))
            console.log(protectedHeader)

            return decoder.decode(payload) === data;
        } catch (error) {
            console.log(error)
            return false;
        }
    }
}