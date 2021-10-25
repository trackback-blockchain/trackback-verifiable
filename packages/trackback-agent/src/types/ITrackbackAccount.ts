import { KeyringPair } from "@polkadot/keyring/types";

export interface ITrackbackAccount {
  keyPair: KeyringPair;
  mnemonic: string;
}
