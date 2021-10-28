import { ITrackbackAccount } from './ITrackbackAccount';
import { ITrackBackAgent } from ".";

export interface ITrackBackContext {
  agent: ITrackBackAgent;
  account: ITrackbackAccount;
}
