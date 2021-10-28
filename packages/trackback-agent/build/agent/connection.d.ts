import { ITrackbackAccount } from './../types/ITrackbackAccount';
import { ApiPromise } from "@polkadot/api";
import { IConnect, ITrackbackAgentOptions } from "../types";
/**
 * TrackBackAgentClass
 * Connects and disconnects RPC to chain
 */
export declare class Connector implements IConnect {
    private options;
    private api;
    constructor(options?: ITrackbackAgentOptions);
    /**
     * Connects to the TrackBack chain
     * @returns Promise<ApiPromise>
     */
    connect(): Promise<ApiPromise>;
    /**
     * Disconnects from chain
     */
    disconnect(): Promise<void>;
    getDefaultAccount(name?: string): Promise<ITrackbackAccount>;
}
/**
 * IPFS storage connector
 */
export declare class DecentralisedFileStoreConnector {
    private options;
    constructor(options?: {
        url: string;
        api: string;
        decentralisedStoreURL: string;
    });
    /**
     *
     * @param cid IPFS Content Identifier
     * @param headers Auth Headers
     * @returns
     */
    getData(cid: string, headers: any): Promise<any>;
    /**
     * # TODO: Replace any
     * Create a DID Document.
     * @param data | The following JSON Structure
     * @param headers | Dictionary holds header information
     */
    postData(data: any, headers: any): Promise<any>;
}
//# sourceMappingURL=connection.d.ts.map