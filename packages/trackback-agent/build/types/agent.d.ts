import { ApiPromise } from "@polkadot/api/promise";
import { ApiOptions } from "@polkadot/api/types";
export interface IConnect {
    connect(): Promise<ApiPromise>;
    disconnect(): Promise<void>;
}
export interface IDecentraliseStoreConnect {
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
export interface IDistributedConnectorOptions {
    url: string;
    api: string;
    decentralisedStoreURL: string;
}
//# sourceMappingURL=agent.d.ts.map