import { check } from "./check";



export class VC {

    /**
     * This specification introduces two new registered claim names,
     * which contain those parts of the standard verifiable credentials and verifiable presentations 
     * where no explicit encoding rules for JWT exist
     * @param options 
     */

    // based on https://www.w3.org/TR/vc-data-model/#jwt-and-jws-considerations

    async issueJWT(options:any) {

        const { keyPair } = options;

        if (!keyPair) {
            throw new TypeError(' keyPair required');
        }

        // run common credential checks
        const { credential } = options;
        if (!credential) {
            throw new TypeError('"credential" parameter is required for issuing.');
        }
        check(credential);

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
            "vc": {
                ...credential
            }
        }

        return keyPair.sign(payload, header)
    }

}

