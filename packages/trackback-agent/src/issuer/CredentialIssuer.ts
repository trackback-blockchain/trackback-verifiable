import { JsonWebKey2020, KeyPairOptions } from '@trackback/key';
import { VC, VP } from '@trackback/vc';

import { ICredentialIssuer, IKeyPair, ICredential } from "../types";


/**
 * Trackback implementation for issuing credentials and presentations
 */
export class CredentialIssuer implements ICredentialIssuer {



  /**
   * Create Verifiable Credentials as JWT
   * @remarks Please see {@link https://www.w3.org/TR/vc-data-model/#json-web-token | 6.3.1 JSON Web Token}
   * @param cred - The credential
   * @param keyPair - The key pair 
   * @returns jwt
   */
  createVerifiableCredentials(
    cred: ICredential,
    keyPair: IKeyPair
  ): Promise<string> {
    if (!cred) throw new Error("Credentials required");

    if (!keyPair) throw new Error("keyPair required");

    const vc = new VC();

    return vc.issueJWT({ keyPair, credential: cred });
  }


  /**
   * Create JWT payload of a JWT based verifiable presentation
   * @remarks Please see {@link https://www.w3.org/TR/vc-data-model/#example-31-jwt-payload-of-a-jwt-based-verifiable-presentation-non-normative | JWT payload of a JWT based verifiable presentation (non-normative)}
   * @param vcs - array of JWT
   * @param keyPair - JWT key pair
   * @returns jwt
   */
  createVerifiablePresentation(
    vcs: string[],
    keyPair: IKeyPair
  ): Promise<string> {

    if (!vcs || vcs.length === 0) throw new Error("One or more VerifiableCredentials required");

    if (!keyPair) throw new Error("keyPair required");

    const presentation = {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiablePresentation'],
      verifiableCredential: [
        ...vcs
      ],
    };

    const vp = new VP();
    return vp.issueJWT({ keyPair, presentation });

  }


  /**
   * Generate IKeyPair
   * @param controller - did uri of the controller
   * @param alg - algorithm key
   * @param options - 
   * @returns 
   */
  generateKeyPair(
    controller?: string,
    alg?: string,
    options?: KeyPairOptions): Promise<IKeyPair> {
    return JsonWebKey2020.generate(controller, alg, options);
  }


  /**
   * import IKeyPair from object
   * @param keyPair - json IKeyPair type
   * @returns IKeyPair
   */
  from(keyPair: any) {
    return JsonWebKey2020.from(keyPair);
  }
}
