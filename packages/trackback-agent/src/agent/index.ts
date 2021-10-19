import { ApiPromise, WsProvider } from '@polkadot/api';

import { ITrackbackAgentOptions } from './../types/agent';
import { ITrackBackAgent, IConnect } from '../types';
import { DefaultOptions } from './helpers';
import { IProcedure, Procedure } from './procedure';

export class TrackBackAgent implements ITrackBackAgent {

  procedure: IProcedure;

  constructor(connection: IConnect | null | undefined) {
    this.procedure = new Procedure(connection);
  }
}