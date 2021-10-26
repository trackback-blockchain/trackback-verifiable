import { RFC3339_REGEX, CREDIENTIAL_CONTEXT, URI_REGEX } from '../constants';
import { isNonEmptyArray } from '../utils';

export function check(credential: any): boolean {

  if (!credential) {
    throw new Error('credential required');
  }

  if (typeof credential === 'string') {
    const [encodedHeader, encodedPayload] = credential.split('.');
    const header = JSON.parse(Buffer.from(encodedHeader, 'base64').toString());
    if (!header.alg) {
      throw new Error('alg parameter is required in JWT header');
    }
    const payload = JSON.parse(
      Buffer.from(encodedPayload, 'base64').toString()
    );
    credential = payload.vc;
  }

  if (!credential['@context'] || !isNonEmptyArray(credential['@context'])) {
    throw new Error('Credentials must have a "@context" property.');
  }

  const context = credential['@context'][0];

  if (context !== CREDIENTIAL_CONTEXT) {
    throw new Error(
      'Credentials first item is a URI with the value https://www.w3.org/2018/credentials/v1'
    );
  }

  if (!credential['type'] || !isNonEmptyArray(credential['type'])) {
    throw new Error('Credentials must have "type".');
  }

  if (!credential['type'].includes('VerifiableCredential')) {
    throw new Error('"type" must have VerifiableCredential');
  }

  if (!credential['credentialSubject']) {
    throw new Error('Credentials must have "credentialSubject"');
  }

  if (!credential['issuer']) {
    throw new Error('Credentials must have "issuer"');
  }

  // fix this

  // if(!URI_REGEX.test(credential['issuer'])){
  //     throw new Error('Credentials must have "issuer"');
  // }

  // TODO: FIXME
  // if (credential["issuanceDate"]) {
  //     if (typeof credential["issuanceDate"] !== 'string') {
  //         throw new Error('"issuanceDate" must be a string.');
  //     }

  //     if (!RFC3339_REGEX.test(credential["issuanceDate"])) {
  //         throw new Error('"issuanceDate" must be RFC 3339 Date Time.');
  //     }
  // }

  return true;
}
