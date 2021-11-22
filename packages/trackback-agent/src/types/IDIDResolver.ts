import { AnyType, DIDDocument } from "./did";

export interface IDIDResolutionOptions extends AnyType {
  accept?: string;
}

export interface IDIDResolutionMetadata extends AnyType {
  contentType?: string;
  error?: "invalidDid" | "notFound" | "representationNotSupported" | string;
}

export class DIDResolutionMetadata implements IDIDResolutionMetadata {}

export interface IDIDDocumentMetadata extends AnyType {
  created?: string;
  updated?: string;
  deactivated?: boolean;
  versionId?: string;
  nextUpdate?: string;
  nextVersionId?: string;
  equivalentId?: string;
  canonicalId?: string;
}

export interface IDIDResolutionResult {
  did_resolution_metadata: IDIDResolutionMetadata;
  did_document: DIDDocument | null;
  did_document_metadata: IDIDDocumentMetadata;
}

export interface ResolverMap {
  [key: string]: IDIDResolver;
}

export interface ParsedResult {
  prefix: string;
  [key: string]: string;
}

export interface IDIDResolver {
  resolve: (
    did: string,
    options: IDIDResolutionOptions
  ) => Promise<IDIDResolutionResult>;

  parseDID: (did: string) => ParsedResult;
}
