import Keyring from '@polkadot/keyring';
import { TrackBackUtils } from '../src/index';
const { v4: uuidv4 } = require('uuid');
async function main() {
  const util = new TrackBackUtils();

  await util.connect();

  const did = {
    '@context': [
      'https://www.w3.org/ns/did/v1',
      'https://w3id.org/security/suites/ed25519-2020/v1',
    ],
    id: 'did:example:123456789abcdefghi' + new Date().getUTCMilliseconds(),
    authentication: [
      {
        id: 'did:example:123456789abcdefghi#keys-1',
        type: 'Ed25519VerificationKey2020',
        controller: 'did:example:123456789abcdefghi',
        publicKeyMultibase: 'zH3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV',
      },
    ],
  };
  // Create a keyring instance
  const keyring = new Keyring({ type: 'sr25519' });
  const alice = keyring.addFromUri('//Alice');



  const r = await util.save(alice, did, { versionId: '1' }, {});
  console.log(r);

  const ll = await util.resolve(did.id)

  console.log(ll)
}

main();
