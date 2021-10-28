"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Procedure = void 0;
const connection_1 = require("./connection");
const enums_1 = require("./enums");
const utils_1 = require("./utils");
/**
 * Facilitates DID operations
 */
class Procedure {
    constructor(connector) {
        if (!connector) {
            this.connector = new connection_1.Connector();
        }
        else {
            this.connector = connector;
        }
    }
    /**
     *
     * @param didUri Resolves a Decentralised Identifier by the DID URI
     * @returns Promise<IDIDResolutionResult>
     */
    resolve(didURI) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const didURIHex = (0, utils_1.uriToHex)(didURI);
            console.log(didURIHex);
            if (!this.connector)
                throw new Error("Throw");
            return (_a = this.connector) === null || _a === void 0 ? void 0 : _a.connect().then((api) => {
                return new Promise((resolve, reject) => {
                    if (!api)
                        return null;
                    api.query.didModule.dIDDocument(didURIHex, (result) => __awaiter(this, void 0, void 0, function* () {
                        console.log(result);
                        if (!result.isEmpty) {
                            let data = (JSON.parse(result.toString()));
                            let cid = (0, utils_1.hexToUtf8)(data.did_ref.substr(2).toString());
                            let desContent = yield new connection_1.DecentralisedFileStoreConnector().getData(cid, null);
                            data["did_document"] = desContent.content;
                            data["did_document_metadata"] = JSON.parse((0, utils_1.hexToUtf8)(data.did_document_metadata.substr(2).toString()));
                            data["did_resolution_metadata"] = JSON.parse((0, utils_1.hexToUtf8)(data.did_resolution_metadata.substr(2).toString()));
                            data["did_ref"] = cid;
                            data["public_keys"] = data.public_keys.map((pk) => {
                                return (0, utils_1.hexToUtf8)(pk.substr(2).toString());
                            });
                            data["sender_account_id"] = (0, utils_1.hexToUtf8)(data.sender_account_id.substr(2).toString());
                            resolve(data);
                        }
                        else {
                            reject();
                        }
                    }));
                })
                    .catch((error) => {
                    console.log(error);
                    return null;
                })
                    .finally(() => {
                    var _a;
                    (_a = this.connector) === null || _a === void 0 ? void 0 : _a.disconnect();
                });
            });
        });
    }
    /**
     * @param didUri Revoke a Decentralised Identifier by the DID URI
     * Simply pass the DID URI to this method to revoke a DID.
     * This action cannot be undone.
     * @returns Promise<ExtrinsicResults>
     */
    revoke(account, didURI) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputParams = [(0, utils_1.uriToHex)(didURI)];
            const paramFields = [true];
            const transformed = (0, utils_1.transformParams)(paramFields, inputParams);
            return this.dispatch(account, enums_1.TrackBackModules.DIDModule, enums_1.TrackBackCallables.DIDRevoke, transformed);
        });
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
    updateDIDDocument(account, didDocument, didDocumentMetadata, didResolutionMetadata, didRef, publicKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            const didDoc = (0, utils_1.toUint8Array)(didDocument);
            const didDocMetadata = (0, utils_1.toUint8Array)(didDocumentMetadata);
            const didDocRes = (0, utils_1.toUint8Array)(didResolutionMetadata);
            const didURI = (0, utils_1.uriToHex)(didDocument.id);
            const inputParams = [didURI, didDocRes, didDocMetadata, didRef, publicKeys];
            const paramFields = [true, true, true, true, true];
            const transformed = (0, utils_1.transformParams)(paramFields, inputParams);
            return this.dispatch(account, enums_1.TrackBackModules.DIDModule, enums_1.TrackBackCallables.DIDUpdate, transformed);
        });
    }
    /**
     * Saves a DID document to a Decentralised file store
     * @param data | A Valid data object
     * @param headers
     * @returns CID wrapped in a Promise
     */
    saveToDistributedStorage(data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            let connector = new connection_1.DecentralisedFileStoreConnector();
            let results = yield connector.postData(data, headers)
                .then((d) => {
                console.log(d);
                return d;
            })
                .catch((error) => {
                console.log(error);
                return { error: error };
            });
            return results;
        });
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
    constructDIDDocument(account, didDocument, didDocumentMetadata, didResolutionMetadata, didRef, publicKeys) {
        return __awaiter(this, void 0, void 0, function* () {
            const didDoc = (0, utils_1.toUint8Array)(didDocument);
            const didDocMetadata = (0, utils_1.toUint8Array)(didDocumentMetadata);
            const didDocRes = (0, utils_1.toUint8Array)(didResolutionMetadata);
            const didURI = (0, utils_1.uriToHex)(didDocument.id);
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
            const transformed = (0, utils_1.transformParams)(paramFields, inputParams);
            return this.dispatch(account, enums_1.TrackBackModules.DIDModule, enums_1.TrackBackCallables.DIDInsert, transformed);
        });
    }
    /**
     * Sends a transform to the TackBack Chain.
     * @param account | Polkadot Account which analogous to `IKeyringPair`
     * @param palletRpc | RPC module in DID Pallet
     * @param callable | RPC method in DID Pallet
     * @param transformed | A valid transform object
     * @returns
     */
    dispatch(account, palletRpc, callable, transformed) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.connector)
                return null;
            return (_a = this.connector) === null || _a === void 0 ? void 0 : _a.connect().then((api) => {
                if (!api)
                    return {
                        Error: true,
                        Message: "dispatchError",
                    };
                return api.rpc.system
                    .accountNextIndex(account.address)
                    .then((nonce) => {
                    return new Promise((resolve) => {
                        const txExecute = api.tx[palletRpc][callable](...transformed);
                        txExecute.signAndSend(account, { nonce }, (result) => {
                            console.log(`Current status is ${JSON.stringify(result)}`);
                            console.log(`Current nonce is ${nonce}`);
                            if (result.status.isInBlock) {
                                console.log(`Block Hash ${result.status.asInBlock}`);
                            }
                            else if (result.status.isFinalized) {
                                if (result.dispatchError) {
                                    resolve({
                                        Error: true,
                                        Message: "dispatchError",
                                    });
                                }
                                else {
                                    console.log(`Finalised Block Hash ${JSON.stringify(result)}`);
                                    resolve({
                                        Error: false,
                                        Message: "Data has been processed successfully",
                                    });
                                }
                            }
                        });
                    });
                });
            }).catch((error) => {
                console.log(error);
                return {
                    Error: true,
                    Message: "Error",
                };
            }).finally(() => {
                var _a;
                (_a = this.connector) === null || _a === void 0 ? void 0 : _a.disconnect();
            });
        });
    }
}
exports.Procedure = Procedure;
//# sourceMappingURL=procedure.js.map