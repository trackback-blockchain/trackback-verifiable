import type { IKeyringPair } from "@polkadot/types/types";
import { DIDDocument, IConnect, IDIDDocumentMetadata, IDIDResolutionMetadata, IDIDResolutionResult } from "../types";
import { ExtrinsicResults } from "./helpers";
export interface IProcedure {
    resolve(didUri: string): Promise<IDIDResolutionResult | null>;
    revoke(account: IKeyringPair, didURI: string): Promise<ExtrinsicResults>;
    constructDIDDocument(account: IKeyringPair, didDocument: DIDDocument, didDocumentMetadata: IDIDDocumentMetadata, didResolutionMetadata: IDIDResolutionMetadata, didRef: string, publicKeys: Array<string>): Promise<ExtrinsicResults>;
    updateDIDDocument(account: IKeyringPair, didDocument: DIDDocument, didDocumentMetadata: IDIDDocumentMetadata, didResolutionMetadata: IDIDResolutionMetadata, didRef: string, publicKeys: Array<String>): Promise<ExtrinsicResults>;
    dispatch(account: IKeyringPair, palletRpc: string, callable: string, transformed: any): Promise<ExtrinsicResults>;
    saveToDistributedStorage(data: any, headers: any): Promise<any>;
}
/**
 * Facilitates DID operations
 */
export declare class Procedure implements IProcedure {
    private connector;
    constructor(connector: IConnect | null | undefined);
    /**
     *
     * @param didUri Resolves a Decentralised Identifier by the DID URI
     * @returns Promise<IDIDResolutionResult>
     */
    resolve(didURI: string): Promise<IDIDResolutionResult | null>;
    /**
     * @param didUri Revoke a Decentralised Identifier by the DID URI
     * Simply pass the DID URI to this method to revoke a DID.
     * This action cannot be undone.
     * @returns Promise<ExtrinsicResults>
     */
    revoke(account: IKeyringPair, didURI: string): Promise<ExtrinsicResults>;
    /**
     * Updates a DID Document metadata
     * Use the method `saveToDistributedStorage` to publish a new version of the DID document and
     * then include the new CID
     * @param account | Polkadot Account
     * @param didDocument | DID Document represented in a JSON Structure
     * - DID Document gets update on IPFS or Decentralosed data store
     * @param didDocumentMetadata | DID Documen metadata JSON List
     * @param didResolutionMetadata | DID Resolution metadata JSON list
     * @param didRef | IPFS URI for the the DID
     * @param publicKeys | Aithorised public keys
     * @returns Promise<ExtrinsicResults>
     */
    updateDIDDocument(account: IKeyringPair, didDocument: DIDDocument, didDocumentMetadata: IDIDDocumentMetadata, didResolutionMetadata: IDIDResolutionMetadata, didRef: string, publicKeys: Array<String>): Promise<ExtrinsicResults>;
    /**
     * Saves a DID document to a Decentralised file store
     * @param data | A Valid data object
     * @param headers
     * @returns CID wrapped in a Promise
     */
    saveToDistributedStorage(data: any, headers: any): Promise<any>;
    /**
     * Saves a DID Document on chain
     * @param account | Polkadot Account
     * @param didDocument | DID Document represented in a JSON Structure
     * @param didDocumentMetadata | DID Documen metadata JSON List
     * @param didResolutionMetadata | DID Resolution metadata JSON list
     * @param didRef | IPFS URI for the the DID
     * @param publicKeys | Aithorised public keys
     * @returns Promise<ExtrinsicResults>
     */
    constructDIDDocument(account: IKeyringPair, didDocument: DIDDocument, didDocumentMetadata: IDIDDocumentMetadata, didResolutionMetadata: IDIDResolutionMetadata, didRef: string, publicKeys: Array<string>): Promise<ExtrinsicResults>;
    /**
     * Sends a transform to the TackBack Chain.
     * @param account | Polkadot Account which analogous to `IKeyringPair`
     * @param palletRpc | RPC module in DID Pallet
     * @param callable | RPC method in DID Pallet
     * @param transformed | A valid transform object
     * @returns
     */
    dispatch(account: IKeyringPair, palletRpc: string, callable: string, transformed: any): Promise<ExtrinsicResults>;
}
//# sourceMappingURL=procedure.d.ts.map