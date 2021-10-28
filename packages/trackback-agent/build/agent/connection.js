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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecentralisedFileStoreConnector = exports.Connector = void 0;
const api_1 = require("@polkadot/api");
const axios_1 = __importDefault(require("axios"));
const helpers_1 = require("./helpers");
/**
 * TrackBackAgentClass
 * Connects and disconnects RPC to chain
 */
class Connector {
    constructor(options = helpers_1.DefaultOptions) {
        this.options = options;
    }
    /**
     * Connects to the TrackBack chain
     * @returns Promise<ApiPromise>
     */
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.api)
                return this.api;
            const { url, options: other } = this.options;
            const { types, rpc } = other;
            const provider = new api_1.WsProvider(url);
            this.api = api_1.ApiPromise.create({ provider: provider, types, rpc });
            return this.api;
        });
    }
    /**
     * Disconnects from chain
     */
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            (yield this.connect()).disconnect();
            this.api = null;
        });
    }
}
exports.Connector = Connector;
/**
 * IPFS storage connector
 */
class DecentralisedFileStoreConnector {
    constructor(options = helpers_1.DistributedStorageOptions) {
        this.options = options;
    }
    // TODO: Setup Auth Headers 
    // |TOD: Replace any
    /**
     *
     * @param cid IPFS Content Identifier
     * @param headers Auth Headers
     * @returns
     */
    getData(cid, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            return axios_1.default.get(cid).then(response => {
                return {
                    CID: cid,
                    content: response.data
                };
            }).catch(error => {
                return {
                    "Error": error,
                };
            });
        });
    }
    /**
     * # TODO: Replace any
     * Create a DID Document.
     * @param data | The following JSON Structure
     * @param headers | Dictionary holds header information
     */
    postData(data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = this.options.url + this.options.api + "ipfs/add";
            return axios_1.default.post(url, data).then((response) => {
                return this.options.decentralisedStoreURL + response.data["cid"];
            }).catch(error => {
                return {
                    "Error": error,
                };
            });
        });
    }
}
exports.DecentralisedFileStoreConnector = DecentralisedFileStoreConnector;
//# sourceMappingURL=connection.js.map