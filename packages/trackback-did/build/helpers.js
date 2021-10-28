"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CONTEXT = exports.DID_FORMAT = void 0;
/**
 * ID Format Regex
 */
exports.DID_FORMAT = /^did:([a-zA-Z0-9_]+):([:[a-zA-Z0-9_.-]+)(\/[^#]*)?(#.*)?$/;
/**
 * Default Context for DID
 * Please refer :- https://www.w3.org/TR/did-core/
 */
exports.DEFAULT_CONTEXT = 'https://www.w3.org/ns/did/v1';
//# sourceMappingURL=helpers.js.map