import moment from 'moment';
import { IKeyPair } from '@trackback/key';

import { W3Credential } from './../types/VerifiableCredential';
import { check } from './check';

/**
 * Trackback implementation for verifiable credential
 * Creates, Validates and Issue JWTs for Verifiable credential.
 *
 * @remarks Please see {@link https://www.w3.org/TR/vc-data-model | W3C Verifiable Credentials data model}
 *
 * @public
 */
export class VC {
  validate(credential?: W3Credential | any): boolean {
    return check(credential);
  }

  /**
   * This specification introduces two new registered claim names,
   * which contain those parts of the standard verifiable credentials and verifiable presentations
   * where no explicit encoding rules for JWT exist
   * @param options
   */

  // based on https://www.w3.org/TR/vc-data-model/#jwt-and-jws-considerations

  async issue(options: {
    keyPair: IKeyPair;
    credential: W3Credential;
  }): Promise<string> {
    const { keyPair } = options;

    if (!keyPair) {
      throw new TypeError(' keyPair required');
    }

    // run common credential checks
    const { credential } = options;
    if (!credential) {
      throw new TypeError('"credential" parameter is required for issuing.');
    }

    const issuer =
      typeof credential.issuer === 'string'
        ? credential.issuer
        : credential?.issuer?.id;
    if (!issuer || typeof issuer === 'undefined') {
      throw new Error('credential issuer required');
    }

    let sub = Array.isArray(credential.credentialSubject)
      ? credential.credentialSubject[0].id
      : credential.credentialSubject.id;
    check(credential);

    const privateKeyJwk = keyPair.getPrivateKey();

    if (!privateKeyJwk) {
      throw new TypeError('Private key required for issuing');
    }
    const header = {
      typ: 'JWT',
      alg: privateKeyJwk.alg,
      kid: keyPair.getId(),
    };

    const payload = {
      sub: sub,
      jti: sub,
      iss: issuer,
      nbf: moment(credential.issuanceDate).unix(),
      vc: {
        ...credential,
      },
    };

    return keyPair.signer().sign(payload, { header });
  }

  async verify(
    jwt: string,
    options: { keyPair: IKeyPair; credential: W3Credential }
  ): Promise<boolean> {
    const { keyPair } = options;

    if (!keyPair) {
      throw new TypeError(' keyPair required');
    }

    const publicKeyJwk = keyPair.getPublicKey();

    if (!publicKeyJwk) {
      throw new TypeError('public key required for verifing');
    }

    const [encodedHeader, encodedPayload] = jwt.split('.');

    const header = JSON.parse(Buffer.from(encodedHeader, 'base64').toString());
    const payload = JSON.parse(
      Buffer.from(encodedPayload, 'base64').toString()
    );

    if (!header.alg) {
      throw new Error('alg is required in JWT header');
    }
    const credential = payload.vc;
    check(credential);

    return keyPair
      .verifier()
      .verify({ data: options.credential, signature: jwt });
  }
}
