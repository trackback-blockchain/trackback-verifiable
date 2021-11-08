import type { IKeyringPair } from "@polkadot/types/types";
import {
  DIDDocument,
  IConnect,
  IDIDDocumentMetadata,
  IDIDResolutionMetadata,
  IDIDResolutionResult,
} from "../types";
import { Connector, DecentralisedFileStoreConnector } from "./connection";
import { TrackBackModules, TrackBackCallables } from "./enums";
import {
  ExtrinsicResults,
  hexToUtf8,
  toUint8Array,
  transformParams,
  uriToHex,
} from "./utils";

export interface IProcedure {
  resolve(didUri: string): Promise<IDIDResolutionResult | null>;
  revoke(account: IKeyringPair, didURI: string): Promise<ExtrinsicResults>
  constructDIDDocument(
    account: IKeyringPair,
    didDocument: DIDDocument,
    didDocumentMetadata: IDIDDocumentMetadata,
    didResolutionMetadata: IDIDResolutionMetadata,
    didRef: string,
    publicKeys: Array<string>
  ): Promise<ExtrinsicResults>;
  updateDIDDocument(
    account: IKeyringPair,
    didDocument: DIDDocument,
    didDocumentMetadata: IDIDDocumentMetadata,
    didResolutionMetadata: IDIDResolutionMetadata,
    didRef: string,
    publicKeys: Array<String>
  ): Promise<ExtrinsicResults>;
  dispatch(
    account: IKeyringPair,
    palletRpc: string,
    callable: string,
    transformed: any
  ): Promise<ExtrinsicResults>;
  saveToDistributedStorage(data: any, headers: any): Promise<any>;
}

/**
 * Facilitates DID operations
 */
export class Procedure implements IProcedure {
  private connector: IConnect;
  private fileConnector: DecentralisedFileStoreConnector;

  constructor(connector?: IConnect, fileConnector?: DecentralisedFileStoreConnector) {
    this.connector = !connector ? new Connector() : connector;
    this.fileConnector = !fileConnector ? new DecentralisedFileStoreConnector() : fileConnector;
  }

  /**
   * 
   * @param didUri Resolves a Decentralised Identifier by the DID URI
   * @returns Promise<IDIDResolutionResult>
   */
  async resolve(didURI: string): Promise<IDIDResolutionResult | null> {
    const didURIHex = uriToHex(didURI);

    if (!this.connector) throw new Error("Throw")
    return this.connector?.connect().then((api) => {
      return new Promise<IDIDResolutionResult>((resolve, reject) => {
        if (!api) return null;
        api.query.didModule.dIDDocument(didURIHex, async (result: any) => {

          if (!result.isEmpty) {
            let data = (JSON.parse(result.toString()));
            let cid = hexToUtf8(data.did_ref.substr(2).toString());
            let desContent = await this.fileConnector.getData(cid, null);
            data["did_document"] = desContent.content;
            data["did_document_metadata"] = JSON.parse(hexToUtf8(data.did_document_metadata.substr(2).toString()));
            data["did_resolution_metadata"] = JSON.parse(hexToUtf8(data.did_resolution_metadata.substr(2).toString()));
            data["did_ref"] = cid;
            data["public_keys"] = data.public_keys.map((pk: string) => {
              return hexToUtf8(pk.substr(2).toString())
            });
            data["sender_account_id"] = hexToUtf8(data.sender_account_id.substr(2).toString());
            resolve(data);
          } else {
            reject();
          }
        });
      })
        .catch((error) => {
          console.log(error);
          return null;
        })
        .finally(() => {
          this.connector?.disconnect();
        });
    });
  }

  /**
   * @param didUri Revoke a Decentralised Identifier by the DID URI
   * Simply pass the DID URI to this method to revoke a DID.
   * This action cannot be undone. 
   * @returns Promise<ExtrinsicResults>
   */
  async revoke(account: IKeyringPair, didURI: string): Promise<ExtrinsicResults> {

    const inputParams = [uriToHex(didURI)];

    const paramFields = [true];

    const transformed = transformParams(paramFields, inputParams);
    return this.dispatch(
      account,
      TrackBackModules.DIDModule,
      TrackBackCallables.DIDRevoke,
      transformed
    );
  }

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
  async updateDIDDocument(
    account: IKeyringPair,
    didDocument: DIDDocument,
    didDocumentMetadata: IDIDDocumentMetadata,
    didResolutionMetadata: IDIDResolutionMetadata,
    didRef: string,
    publicKeys: Array<String>
  ): Promise<ExtrinsicResults> {

    const didDocMetadata = toUint8Array(didDocumentMetadata);
    const didDocRes = toUint8Array(didResolutionMetadata);
    const didURI = uriToHex(didDocument.id);

    const inputParams = [didURI, didDocRes, didDocMetadata, didRef, publicKeys];

    const paramFields = [true, true, true, true, true];

    const transformed = transformParams(paramFields, inputParams);
    return this.dispatch(
      account,
      TrackBackModules.DIDModule,
      TrackBackCallables.DIDUpdate,
      transformed
    );
  }

  /**
   * Saves a DID document to a Decentralised file store
   * @param data | A Valid data object
   * @param headers 
   * @returns CID wrapped in a Promise
   */
  async saveToDistributedStorage(data: any, headers: any): Promise<any> {

    return this.fileConnector.postData(data, headers)
      .then((d) => {
        return d;
      })
      .catch((error) => {
        console.log(error)
        return { error: error }
      }
      );
  }

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
  async constructDIDDocument(
    account: IKeyringPair,
    didDocument: DIDDocument,
    didDocumentMetadata: IDIDDocumentMetadata,
    didResolutionMetadata: IDIDResolutionMetadata,
    didRef: string,
    publicKeys: Array<string>
  ): Promise<ExtrinsicResults> {
    const didDoc = toUint8Array(didDocument);
    const didDocMetadata = toUint8Array(didDocumentMetadata);
    const didDocRes = toUint8Array(didResolutionMetadata);

    const didURI = uriToHex(didDocument.id);

    const inputParams = [
      didDoc,
      didDocMetadata,
      didDocRes,
      account.address,
      didURI,
      didRef,
      publicKeys,
    ];

    const paramFields = [true, true, true, true, true, true, true];

    const transformed = transformParams(paramFields, inputParams);

    return this.dispatch(
      account,
      TrackBackModules.DIDModule,
      TrackBackCallables.DIDInsert,
      transformed
    );
  }

  /**
   * Sends a transform to the TackBack Chain.
   * @param account | Polkadot Account which analogous to `IKeyringPair`
   * @param palletRpc | RPC module in DID Pallet
   * @param callable | RPC method in DID Pallet
   * @param transformed | A valid transform object
   * @returns
   */
  async dispatch(
    account: IKeyringPair,
    palletRpc: string,
    callable: string,
    transformed: any
  ): Promise<ExtrinsicResults> {
    if (!this.connector) return null;
    return this.connector?.connect()
      .then((api) => {
        if (!api)
          return {
            Error: true,
            Message: "dispatchError",
          };

        return api.rpc.system
          .accountNextIndex(account.address)
          .then((nonce) => {
            return new Promise<ExtrinsicResults>((resolve) => {
              const txExecute = api.tx[palletRpc][callable](...transformed);

              txExecute.signAndSend(account, { nonce }, (result: any) => {
                if (result.status.isFinalized) {
                  if (result.dispatchError) {
                    resolve({
                      Error: true,
                      Message: "dispatchError",
                    });
                  } else {
                    console.log(
                      `Finalised Block Hash ${JSON.stringify(result)}`
                    );
                    resolve({
                      Error: false,
                      Message: "Data has been processed successfully",
                    });
                  }
                }
              });
            });
          });
      })
      .catch((error) => {
        console.log(error);
        return {
          Error: true,
          Message: "Error",
        };
      })
      .finally(() => {
        this.connector?.disconnect();
      });
  }
}
