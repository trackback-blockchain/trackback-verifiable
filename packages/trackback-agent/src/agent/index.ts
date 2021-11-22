import { ITrackBackAgent, IConnect, ITrackbackAccount } from '../types';
import { IProcedure, Procedure } from './procedure';
import { createAccount } from './account';
import { DecentralisedFileStoreConnector } from './connection';

export * from './connection'
export * from './account'
export * from './enums'
export * from './utils'

export class TrackBackAgent implements ITrackBackAgent {

  procedure: IProcedure;

  constructor(connection?: IConnect, fileConnector?: DecentralisedFileStoreConnector) {
    this.procedure = new Procedure(connection, fileConnector);
  }


  createAccount(metadata: { [key: string]: string }): ITrackbackAccount {
    return createAccount(metadata)
  }

}