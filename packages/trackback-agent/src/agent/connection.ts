import { ApiPromise, WsProvider } from "@polkadot/api";
import { IConnect, ITrackbackAgentOptions } from "../types";
import { DefaultOptions } from "./helpers";

/**
 * TrackBackAgentClass
 * Connects and disconnects RPC to chain
 */
 export class Connector implements IConnect {
    private options: ITrackbackAgentOptions;
    private api: Promise<ApiPromise> | null | undefined;
  
    constructor(options: ITrackbackAgentOptions = DefaultOptions) {
      this.options = options;
    }
  
    /**
     * Connects to the TrackBack chain
     * @returns Promise<ApiPromise>
     */
    async connect(): Promise<ApiPromise> {
      if (this.api) return this.api;
  
      const { url, options: other } = this.options;
      const { types, rpc } = other;
  
      const provider = new WsProvider(url);
  
      this.api = ApiPromise.create({ provider: provider, types, rpc });
      return this.api;
    }
  
    /**
     * Disconnects from chain
     */
    async disconnect(): Promise<void> {
      (await this.connect()).disconnect();
      this.api = null;
    }
  }