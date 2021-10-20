/// <reference types="node" />
import { Ed25519VerificationKey2018, IEd25519KeyPair } from '../types';
export declare class Ed25519KeyPair implements IEd25519KeyPair {
    id: string;
    controller: string;
    publicKey: Uint8Array;
    privateKey?: Uint8Array;
    constructor(options: {
        id: string;
        controller: string;
        publicKey: Uint8Array;
        privateKey?: Uint8Array;
    });
    static generate(): Promise<Ed25519KeyPair>;
    static secureRandom: () => Buffer;
    static generateKeyfingerprint(publicKey: Uint8Array): string;
    exportAsEd25519VerificationKey2018(): Ed25519VerificationKey2018;
    /**
     *
     * @param publicKey
     * @param contentType
     * @returns
     */
    static toDIDDocument(publicKey: Uint8Array, contentType: string): {
        id: string;
        verificationMethod: {
            id: string;
            type: string;
            controller: string;
            publicKeyBase58: string;
        }[];
        authentication: string[];
        assertionMethod: string[];
        capabilityDelegation: string[];
        capabilityInvocation: string[];
        keyAgreement: {
            id: string;
            type: string;
            controller: string;
            publicKeyBase58: string;
        }[];
    };
}
//# sourceMappingURL=Ed25519KeyPair.d.ts.map