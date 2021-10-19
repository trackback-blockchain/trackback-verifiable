import { AbstractJsonWebKey } from './types';
import { flattenedVerify } from 'jose/jws/flattened/verify';
import { generateKeyPair, GenerateKeyPairOptions } from 'jose/util/generate_key_pair'
import { exportJWK } from 'jose/key/export'
import { importJWK } from 'jose/key/import'
import type { FlattenedJWS, JWK } from 'jose/types';
import { calculateThumbprint } from 'jose/jwk/thumbprint'
import { FlattenedSign } from 'jose/jws/flattened/sign'

import { Encoding } from './encoding/Encoding';


// based on https://github.com/w3c-ccg/lds-jws2020
// https://github.com/w3c-ccg/lds-jws2020
// not all alg is supported

const DEFAULT_ALG = "EdDSA";
const DEFAULT_CRV_LENGTH = { crv: 'Ed25519' }

/**
 * check header has deattached params
 * @param encodedHeader 
 * @returns 
 */
function isDeattachedHeader(encodedHeader: string) {
    try {
        const header = JSON.parse(Encoding.base64Decode(encodedHeader));
        return header?.b64 === false && header.crit[0] === 'b64';
    } catch (error) {
        console.log(error)
    }
    return false;
}

export class JsonWebKey2020 extends AbstractJsonWebKey {
    public id: string;
    public type: string;
    public controller: string;
    public publicKeyJwk: JWK;
    public privateKeyJwk?: JWK;


    constructor(option: { id: string, type: string, controller: string, publicKeyJwk: JWK, privateKeyJwk?: JWK }) {
        super();
        this.id = option.id;
        this.type = option.type;
        this.controller = option.controller;
        this.publicKeyJwk = option.publicKeyJwk;
        this.privateKeyJwk = option.privateKeyJwk;
    }

    static async generate(controller?: string, alg?: string, options?: GenerateKeyPairOptions): Promise<JsonWebKey2020> {

        alg = alg || DEFAULT_ALG;
        const { publicKey, privateKey } = await generateKeyPair(alg, options || DEFAULT_CRV_LENGTH);

        const privateKeyJwk: JWK = await exportJWK(privateKey);
        const publicKeyJwk: JWK = await exportJWK(publicKey);
        const thumbprint = await calculateThumbprint(publicKeyJwk);
        const _controller = controller || `did:trackback:key:${thumbprint}`;

        if (!privateKeyJwk.alg) {
            privateKeyJwk.alg = alg;
        }
        if (!publicKeyJwk.alg) {
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

    getId(): string {
        return this.id;
    }

    getController(): string {
        return this.controller;
    }

    getPublicKeyJwk(): JWK {
        return this.publicKeyJwk;
    }
    getPrivateKeyJwk(): JWK | undefined {
        return this.privateKeyJwk;
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
            async sign(data: any, options?: any) {
                return _this.sign(data, options);
            }
        }

    }

    async sign(data: any, options?: { deattached: boolean, header: any }): Promise<string> {
        const deattachedHeaders = {
            b64: false,
            crit: ['b64'],
        }
        const _header = {
            alg: this.privateKeyJwk?.alg,
            ...(options?.deattached ? deattachedHeaders : undefined),
            ...(options?.header),
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



    verifier() {
        if (!this.publicKeyJwk) {
            return {
                verify({ data, signature }: { data: any, signature: string }) {
                    throw new Error('Public key required')
                }
            }
        }

        const _this = this;

        return {
            async verify({ data, signature }: { data: any, signature: string }) {
                try {

                    const [encodedHeader, payloadEncoded, sig] = signature.split(".");

                    const isDeattached = isDeattachedHeader(encodedHeader);

                    const payloadToSign = typeof data === 'string' ? data : JSON.stringify(data);

                    const jws = {
                        signature: sig,
                        payload: isDeattached ? (payloadToSign) : payloadEncoded,
                        protected: encodedHeader
                    }

                    const result = await flattenedVerify(jws, await importJWK(_this.publicKeyJwk))

                    return Boolean(result);
                } catch (error) {
                    console.log(error)
                }
                return false
            }
        }

    }

}
