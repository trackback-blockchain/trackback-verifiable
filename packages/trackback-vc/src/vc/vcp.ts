export class VCP {


    async issueJWT(options: any) {

        const { keyPair } = options;

        if (!keyPair) {
            throw new TypeError(' keyPair required');
        }

        // run common credential checks
        const { credential } = options;
        if (!credential) {
            throw new TypeError('"credential" parameter is required for issuing.');
        }

        const publicKeyJwk = keyPair.getPublicKeyJwk();

        if (!publicKeyJwk) {
            throw new TypeError('Generate key pair');
        }
        const header = {
            typ: "JWT",
            alg: keyPair.getAlgorithm(),
            kid: keyPair.getId(),
        }

        // TODO:: FILL
        const payload = {
            "sub": "",
            "jti": "",
            "iss": "",
            "nbf": "",
            "iat": "",
            "exp": "",
            "nonce": "",
            "vcp": {
                ...credential
            }
        }

        return keyPair.sign(payload, header)
    }
}