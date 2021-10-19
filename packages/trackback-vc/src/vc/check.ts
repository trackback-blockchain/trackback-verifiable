

import { RFC3339_REGEX, CREDIENTIAL_CONTEXT, URI_REGEX } from '../constants';

function isNonEmptyArray(item: any): boolean {
    return Array.isArray(item) && item.length > 0
}


export function check(credential: any): boolean {
    if (!credential) {
        throw new Error('credential required')
    }

    if (!credential["@context"] || !isNonEmptyArray(credential["@context"])) {
        throw new Error('Credentials must have a "@context" property.');
    }

    const context = credential['@context'][0];

    if (context !== CREDIENTIAL_CONTEXT) {
        throw new Error("Credentials first item is a URI with the value https://www.w3.org/2018/credentials/v1");
    }

    if (!credential["type"] || !isNonEmptyArray(credential["type"])) {
        throw new Error('Credentials must have "type".');
    }


    if (!credential['type'].includes("VerifiableCredential")) {
        throw new Error('"type" must have VerifiableCredential');
    }

    if (!credential["credentialSubject"]) {
        throw new Error('Credentials must have "credentialSubject"');
    }

    if (!credential["issuer"]) {
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
