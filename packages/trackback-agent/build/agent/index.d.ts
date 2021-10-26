import { ITrackBackAgent, IConnect, ITrackbackAccount } from '../types';
import { IProcedure } from './procedure';
export declare class TrackBackAgent implements ITrackBackAgent {
    procedure: IProcedure;
    constructor(connection: IConnect | null | undefined);
    createAccount(metadata: {
        [key: string]: string;
    }): ITrackbackAccount;
}
//# sourceMappingURL=index.d.ts.map