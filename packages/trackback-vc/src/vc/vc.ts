import moment from "moment";

import { CREDIENTIAL_CONTEXT, VERIFIABLE_CREDENTIALS } from "../constants";
import { CredentialStatus, CredentialSubject, Issuer } from "../types";
import { check } from "./check";


export class CredentialBuilder {

    private _context: string[] = [
        CREDIENTIAL_CONTEXT
    ];

    private _type: Set<string> = new Set<string>();

    private _credentialSubject?: CredentialSubject;

    private _issuer?: Issuer;

    private _issuanceDate?: string;
    private _expirationDate?: string;
    private _id?: string;
    private _status?: CredentialStatus;

    setContext(context: string[]) {
        this._context = [...this._context, ...context]
        return this;
    }

    setId(id: string) {
        this._id = id;
    }

    setType(types: string[]) {
        types.forEach((type) => {
            this._type.add(type)
        })
        return this;
    }

    setCredentialSubject(subject: CredentialSubject) {
        this._credentialSubject = subject;
        return this;
    }

    setIssuer(issuer: Issuer) {
        this._issuer = issuer;
        return this;
    }

    setCredentialStatus(status: CredentialStatus) {
        this._status = status;
        return this;
    }

    /**
     * RFC_3339
     * @param {string} date RFC_3339 format
     * @returns 
     */
    setIssuanceDate(date: string | Date) {
        const _date = (typeof date !== 'string') ? moment(date).toISOString() : date
        this._issuanceDate = _date;
        return this;
    }

    setExpirationDate(date: string | Date) {
        const _date = (typeof date !== 'string') ? moment(date).toISOString() : date
        this._expirationDate = _date;
        return this;
    }

    build() {

        const type = Array.from(this._type);
        if (!type.includes(VERIFIABLE_CREDENTIALS)) {
            type.push(VERIFIABLE_CREDENTIALS);
        }

        const cred = {
            '@context': [...this._context],
            'id': this._id,
            'type': type,
            'credentialSubject': this._credentialSubject,
            'issuer': this._issuer,
            'issuanceDate': this._issuanceDate,
            'expirationDate': this._expirationDate,
            'credentialStatus': this._status,

        };

        // remove null values
        const cleanedCredentials = Object.fromEntries(Object.entries(cred).filter(([_, v]) => v != null))

        console.log(cleanedCredentials)
        check(cleanedCredentials);

        return cleanedCredentials;
    }

}


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

