
export interface IVerifier {
    verify: (options?: any) => Promise<any>;
}

export interface ISigner {
    sign: (data: any, ...args: any[]) => any;
}

export abstract class AbstractJsonWebKey {
    abstract signer(): ISigner
    abstract verifier(): IVerifier
    abstract getId(): string
    abstract getController(): string
    abstract getPublicKeyJwk(): any
    abstract getPrivateKeyJwk(): any

}