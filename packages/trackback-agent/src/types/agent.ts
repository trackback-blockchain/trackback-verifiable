import { ApiOptions } from '@polkadot/api/types';


export interface ITrackbackAgent {

}

export interface IDIDManager {

}

export interface ITrackbackAgentOptions {
    url: string;
    options: ApiOptions;
    didManager: IDIDManager;
}