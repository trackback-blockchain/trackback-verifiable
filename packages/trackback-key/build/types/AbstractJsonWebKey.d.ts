import { IKeyPair } from './IKeyPair';
import { ISigner } from './ISigner';
import { IVerifier } from './IVerifier';
export declare abstract class AbstractJsonWebKey implements IKeyPair {
    id: string;
    type: string;
    controller: string;
    publicKeyJwk: any;
    abstract signer(): ISigner;
    abstract verifier(): IVerifier;
    abstract getId(): string;
    abstract getController(): string;
    abstract getPublicKey(): any;
    abstract getPrivateKey(): any;
    abstract toDIDDocument(): any;
}
//# sourceMappingURL=AbstractJsonWebKey.d.ts.map