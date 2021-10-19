import { ApiPromise } from '@polkadot/api/promise';
import { ApiOptions } from '@polkadot/api/types';


export interface IConnect {
    connect(): Promise<ApiPromise>;
    disconnect(): Promise<void>;
}

export interface ITrackBackAgent {

}

export interface IDIDManager {
     
}

export interface IKeyManager {

}

export interface ITrackbackAgentOptions {
    url: string;
    options: ApiOptions;
    didManager?: IDIDManager;
}


