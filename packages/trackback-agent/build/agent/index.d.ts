import { ITrackBackAgent, IConnect, ITrackbackAccount } from '../types';
import { IProcedure } from './procedure';
export * from './connection';
export * from './account';
export * from './enums';
export * from './utils';
export declare class TrackBackAgent implements ITrackBackAgent {
    procedure: IProcedure;
    constructor(connection: IConnect | null | undefined);
    createAccount(metadata: {
        [key: string]: string;
    }): ITrackbackAccount;
}
//# sourceMappingURL=index.d.ts.map