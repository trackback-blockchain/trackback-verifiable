
import { ITrackBackAgent, IConnect } from '../types';
import { IProcedure, Procedure } from './procedure';

export class TrackBackAgent implements ITrackBackAgent {

  procedure: IProcedure;

  constructor(connection: IConnect | null | undefined) {
    this.procedure = new Procedure(connection);
  }
}