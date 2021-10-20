import { AbstractJsonWebKey } from './types';
import { GenerateKeyPairOptions } from 'jose/util/generate_key_pair';
import type { JWK } from 'jose/types';
export declare class JsonWebKey2020 extends AbstractJsonWebKey {
    id: string;
    type: string;
    controller: string;
    publicKeyJwk: JWK;
    privateKeyJwk?: JWK;
    constructor(option: {
        id: string;
        type: string;
        controller: string;
        publicKeyJwk: JWK;
        privateKeyJwk?: JWK;
    });
    static generate(controller?: string, alg?: string, options?: GenerateKeyPairOptions): Promise<JsonWebKey2020>;
    getId(): string;
    getController(): string;
    getPublicKeyJwk(): JWK;
    getPrivateKeyJwk(): JWK | undefined;
    static from(keyPair: any): JsonWebKey2020;
    static fingerprint(publicKeyJwk: JWK): Promise<string>;
    signer(): {
        sign(data: any, options?: any): Promise<string>;
    };
    sign(data: any, options?: {
        deattached: boolean;
        header: any;
    }): Promise<string>;
    private _sign;
    verifier(): {
        verify({ data, signature }: {
            data: any;
            signature: string;
        }): Promise<boolean>;
    };
}
//# sourceMappingURL=JsonWebKey2020.d.ts.map