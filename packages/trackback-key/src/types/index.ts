import type { KeyObject } from 'crypto'

export interface Ed25519VerificationKey2018 {
    id: string;
    type: string;
    controller: string;
    publicKeyBase58: string;
    privateKeyBase58?: string;
}

export interface IEd25519KeyPair {
    id?: string;
    controller?: string;
    publicKey: Uint8Array;
    privateKey?: Uint8Array;

}
export interface IX25519KeyPair {
    id?: string;
    controller?: string;
    publicKey: KeyObject | CryptoKey;
    privateKey?: KeyObject | CryptoKey;

}


export * from './AbstractJsonWebKey'