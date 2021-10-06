import { Encoding } from "../encoding/Encoding";
import { ISignatureSuite } from "../types";
import { CompactSign } from 'jose/jws/compact/sign';
import { Ed25519KeyPair } from "./Ed25519KeyPair";

export const detachedHeader = {
    b64: false,
    crit: ['b64'],
};

export class Ed255192018SignatureSuite implements ISignatureSuite {

    private keyPair: Ed25519KeyPair;

    constructor() {
        // this.keyPair = await Ed25519KeyPair.generateX25519();
    }

}