import { KeyPairOptions } from './types/index';
import { AbstractJsonWebKey } from './types';
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
    static generate(controller?: string, alg?: string, options?: KeyPairOptions): Promise<JsonWebKey2020>;
    getId(): string;
    getController(): string;
    getPublicKey(): JWK;
    getPrivateKey(): JWK | undefined;
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
    toDIDDocument(didUri?: string): {
        '@context': string;
        id: string;
        publicKey: {
            id: string;
            type: string;
            controller: string;
            publicKeyJwk: JWK;
            privateKeyJwk?: JWK | undefined;
        }[];
        authentication: string[];
        assertionMethod: string[];
        capabilityDelegation: string[];
        capabilityInvocation: string[];
    };
}
//# sourceMappingURL=JsonWebKey2020.d.ts.map