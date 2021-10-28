/**
 * ID Format Regex
 */
export const DID_FORMAT =
  /^did:([a-zA-Z0-9_]+):([:[a-zA-Z0-9_.-]+)(\/[^#]*)?(#.*)?$/;

/**
 * Default Context for DID
 * Please refer :- https://www.w3.org/TR/did-core/
 */ 
export const DEFAULT_CONTEXT = 'https://www.w3.org/ns/did/v1';
