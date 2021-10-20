"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPresentation = void 0;
const utils_1 = require("../utils");
const check_1 = require("../credential/check");
const checkPresentation = (presentation) => {
    if (!presentation)
        throw new Error('Presentation or jwt is required');
    // check presentation is jwt format.
    if (typeof presentation === 'string') {
        const [encodedHeader, encodedPayload] = presentation.split('.');
        const header = JSON.parse(Buffer.from(encodedHeader, 'base64').toString());
        if (!header.alg) {
            throw new Error('alg parameter is required in JWT header');
        }
        const payload = JSON.parse(Buffer.from(encodedPayload, 'base64').toString());
        presentation = payload.vp;
    }
    if (!presentation['@context']) {
        throw new Error('@context required.');
    }
    if (!presentation['type'] || !(0, utils_1.isNonEmptyArray)(presentation['type'])) {
        throw new Error('Credentials must have "type".');
    }
    if (presentation.verifiableCredential) {
        const credentials = Array.isArray(presentation.verifiableCredential)
            ? presentation.verifiableCredential
            : [presentation.verifiableCredential];
        credentials.map((verifiedCredential) => (0, check_1.check)(verifiedCredential));
    }
};
exports.checkPresentation = checkPresentation;
//# sourceMappingURL=check.js.map