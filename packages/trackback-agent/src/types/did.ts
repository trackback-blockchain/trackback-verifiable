
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyType = Record<string, any>;

export interface DIDResolutionResult {
    didResolutionMetadata: DIDResolutionMetadata;
    didDocument: DIDDocument | null;
    didDocumentMetadata: DIDDocumentMetadata;
}

export interface DIDResolutionOptions extends AnyType {
    accept?: string;
}

export interface DIDResolutionMetadata extends AnyType {
    contentType?: string;
    error?: 'invalidDid' | 'notFound' | 'representationNotSupported' | string;
}

export interface DIDDocumentMetadata extends AnyType {
    created?: string;
    updated?: string;
    deactivated?: boolean;
    versionId?: string;
    nextUpdate?: string;
    nextVersionId?: string;
    equivalentId?: string;
    canonicalId?: string;
}

export interface DIDDocument extends AnyType {
    '@context'?: string | string[];
    id: string;
}