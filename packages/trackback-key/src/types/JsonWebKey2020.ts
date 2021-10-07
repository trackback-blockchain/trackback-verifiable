import type { JWK } from 'jose/types';

export type JsonWebKey2020 = {

    id: string;
    type: string;
    controller: string;
    publicKeyJwk: JWK;
    privateKeyJwk: JWK;

    generate: () => Promise<JsonWebKey2020>;
    sign: () => Promise<string>;
    verify: () => Promise<boolean>;

}