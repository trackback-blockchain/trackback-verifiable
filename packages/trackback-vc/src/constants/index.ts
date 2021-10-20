export const CONTENT_TYPE_DID_LD_JSON = 'application/did+ld+json';
export const CONTENT_TYPE_DID_JSON = 'application/did+json';

export const CREDIENTIAL_CONTEXT = 'https://www.w3.org/2018/credentials/v1';

export const VERIFIABLE_CREDENTIALS = 'VerifiableCredential';

//https://regex101.com/r/qH0sU7/1
export const RFC3339_REGEX =
  /^((?:(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2}(?:\.\d+)?))(Z|[\+-]\d{2}:\d{2})?)$/gm;

// TODO replace this.
export const URI_REGEX =
  /(?:[A-Za-z][A-Za-z0-9+.-]*:\/{2})?(?:(?:[A-Za-z0-9-._~]|%[A-Fa-f0-9]{2})+(?::([A-Za-z0-9-._~]?|[%][A-Fa-f0-9]{2})+)?@)?(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\\.){1,126}[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?::[0-9]+)?(?:\/(?:[A-Za-z0-9-._~]|%[A-Fa-f0-9]{2})*)*(?:\\?(?:[A-Za-z0-9-._~]+(?:=(?:[A-Za-z0-9-._~+]|%[A-Fa-f0-9]{2})+)?)(?:&|;[A-Za-z0-9-._~]+(?:=(?:[A-Za-z0-9-._~+]|%[A-Fa-f0-9]{2})+)?)*)?/;
