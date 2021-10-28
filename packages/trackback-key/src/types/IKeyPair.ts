import { IVerifier } from './IVerifier';
import { ISigner } from './ISigner';

export interface IKeyPair {

    id: string;
    type: string;
    controller: string;
    publicKeyJwk: any;

    signer(): ISigner;
    verifier(): IVerifier;

    getId(): string;
    getController(): string;
    getPublicKey(): any;
    getPrivateKey(): any;


    toDIDDocument(): any;
}
