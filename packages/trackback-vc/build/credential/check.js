"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.check = void 0;
const constants_1 = require("../constants");
const utils_1 = require("../utils");
function check(credential) {
    if (!credential) {
        throw new Error('credential required');
    }
    if (typeof credential === 'string') {
        const [encodedHeader, encodedPayload] = credential.split('.');
        const header = JSON.parse(Buffer.from(encodedHeader, 'base64').toString());
        if (!header.alg) {
            throw new Error('alg parameter is required in JWT header');
        }
        const payload = JSON.parse(Buffer.from(encodedPayload, 'base64').toString());
        credential = payload.vc;
    }
    if (!credential['@context'] || !(0, utils_1.isNonEmptyArray)(credential['@context'])) {
        throw new Error('Credentials must have a "@context" property.');
    }
    const context = credential['@context'][0];
    if (context !== constants_1.CREDIENTIAL_CONTEXT) {
        throw new Error('Credentials first item is a URI with the value https://www.w3.org/2018/credentials/v1');
    }
    if (!credential['type'] || !(0, utils_1.isNonEmptyArray)(credential['type'])) {
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
exports.check = check;
//# sourceMappingURL=check.js.map