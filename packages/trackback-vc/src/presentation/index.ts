import moment from 'moment';
import { AbstractJsonWebKey } from '@trackback/key';
import { checkPresentation } from './check';

/**
 * Presenation JWT sign options
 * @public
 */
export interface IJWTSignOptions {
  /**
   * Implementation of JsonWebKey2020
   */
  keyPair: AbstractJsonWebKey;

  /**
   * presenation
   *
   */
  presentation: any;

  /**
   * aditional headers to include in jwt
   */
  headers?: any;
}

/**
 * Presenation JWT verify options
 * @public
 */
export interface IJWTVerifyOptions {
  /**
   * Implementation of JsonWebKey2020
   */
  keyPair: AbstractJsonWebKey;

  /**
   * presenation
   *
   */
  presentation: any;
}

/**
 * Trackback implementation for verifiable presentation
 * Creates, Validates and Issue JWTs for Verifiable Presentation.
 *
 * @remarks Please see {@link https://www.w3.org/TR/vc-data-model | W3C Verifiable Credentials data model}
 *
 * @public
 */

export class VP {
  /**
   * Validate presentation. throw error if invalid
   * @param presentation presentation object or jwt
   */
  validate(presentation: any) {
    checkPresentation(presentation);
  }

  /**
   * Trackback implementation JSON Web Token
   *
   * @remarks Please see {@link https://www.w3.org/TR/vc-data-model/#json-web-token | 6.3.1 JSON Web Token}
   *
   * @param options {IJWTSignOptions} Parameter nessasary to create a JSON Web Token.
   * @returns Promise<string> jwt
   */
  async issueJWT(options: IJWTSignOptions): Promise<string> {
    const { keyPair } = options;

    if (!keyPair) {
      throw new TypeError(' keyPair required');
    }

    // run common credential checks
    const { presentation } = options;
    if (!presentation) {
      throw new TypeError('"presentation" parameter is required for issuing.');
    }
    this.validate(presentation);

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
      jti: presentation.id,
      nbf: moment().unix(),
      ...options?.headers,
      vp: {
        ...presentation,
      },
    };

    return keyPair.signer().sign(payload, { header });
  }

  /**
   * verify jwt presentation
   *
   * @remarks Please see {@link https://www.w3.org/TR/vc-data-model/#json-web-token | 6.3.1 JSON Web Token}
   *
   * @param jwt jwt token
   * @param options {IJWTVerifyOptions} options for verifing jwt
   * @returns {Promise<boolean>}  A promise result
   */

  async verifyJWT(jwt: string, options: IJWTVerifyOptions): Promise<boolean> {
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
    this.validate(payload.vp);

    return keyPair
      .verifier()
      .verify({ data: options.presentation, signature: jwt });
  }
}
