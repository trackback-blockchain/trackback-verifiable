import { ApiPromise, WsProvider } from "@polkadot/api";
import Keyring from "@polkadot/keyring";

import axios from "axios";
import { IConnect, IDistributedConnectorOptions, ITrackbackAgentOptions, ITrackbackAccount } from "../types";
import { DefaultOptions, DistributedStorageOptions } from "./utils";
import { createAccount, getAccount } from '.';

/**
 * TrackBackAgentClass
 * Connects and disconnects RPC to chain
 */
export class Connector implements IConnect {
  private options: ITrackbackAgentOptions;
  private api: Promise<ApiPromise> | null | undefined;

  constructor(options?: ITrackbackAgentOptions) {

    this.options = options || DefaultOptions;
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

  async getDefaultAccount(name?: string): Promise<ITrackbackAccount> {
    await this.connect();
    const keyring = new Keyring({ type: 'sr25519' });
    const keyPair = keyring.addFromUri((name || "//Alice"));

    return {
      keyPair: keyPair,
      mnemonic: name || "Alice"
    }
  }



  async createAccount(metadata?: { [key: string]: string }): Promise<ITrackbackAccount> {
    await this.connect()
    return createAccount(metadata);
  }


  async getAccount(mnemonic:string): Promise<ITrackbackAccount> {
    await this.connect()
    return getAccount(mnemonic)
  }

}

/**
 * IPFS storage connector
 */
export class DecentralisedFileStoreConnector {
  private options: IDistributedConnectorOptions;
  constructor(options = DistributedStorageOptions) {
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
  async getData(cid: string, headers: any): Promise<any> {
    return axios.get(cid).then(response => {
      return {
        CID: cid,
        content: response.data
      };
    }).catch(error => {
      return {
        "Error": error,
      }
    });
  }
  /**
   * # TODO: Replace any
   * Create a DID Document.
   * @param data | The following JSON Structure
   * @param headers | Dictionary holds header information
   */
  async postData(data: any, headers: any): Promise<any> {

    let url = this.options.url + this.options.api + "ipfs/add";
    return axios.post(url, data).then((response: any) => {
      return this.options.decentralisedStoreURL + response.data["cid"];
    }).catch(error => {
      return {
        "Error": error,
      }
    })

  }
}