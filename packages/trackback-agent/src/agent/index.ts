import { ITrackBackAgent, IConnect, ITrackbackAccount } from '../types';
import { IProcedure, Procedure } from './procedure';
import { createAccount } from './account';

export class TrackBackAgent implements ITrackBackAgent {

  procedure: IProcedure;

  constructor(connection: IConnect | null | undefined) {
    this.procedure = new Procedure(connection);
  }


  createAccount(metadata: { [key: string]: string }): ITrackbackAccount {
    return createAccount(metadata)
  }

}