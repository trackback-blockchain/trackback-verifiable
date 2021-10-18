import { expect } from 'chai';
import {TrackBackAgent} from '../../src/agent';
import { Keyring } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import {WebSocket, Server} from 'mock-socket';

const didDocument =  {
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/ed25519-2020/v1"
  ],
  "id": "did:trackback.dev:0xaseb1b3",
  "assertionMethod": [
    {
      "id": "did:trackback.dev:dia-0x12345678999",
      "type": "Ed25519VerificationddKey2020", 
      "controller": "did:trackbackdev:dia-0x1234567890",
      "publicKeyMultibadfddesse": "publicKey"
    }
  ]
}

const didDocumentMetadata = {
  "key1": "value1",
  "key2": "value2"
}

const didResolutionMetadata = {
  "key1": "value1",
  "key2": "value2"

}

const publicKeys = [
  "zFRxW9CSU1o8+zeW7im8ukVIhnxlSBYJ9x3ISBq6h2M=",
  "vaDp3EX2xwXak9Js3wG7bzfzREajPaK5PxMPWbiyFWk=",
  "5hglsxvy06HhqAeHoGmVO/08Coy8fce/ATYDS9SnEvM=",
  "hDxfP9altb1eHt4AwIwNpF78YWc+fYvpu/e/jRSgPFE="

]

const didRef = "https://ipfs.trackback.dev:8080/ipfs/did-document-cid";

describe('generate', () => {

  it('default is ed25519', async () => {
    
    ///const

    await cryptoWaitReady().then(async () => {
      // load all available addresses and accounts

      const keyring = new Keyring({ type: 'sr25519' });


      const account = keyring.addFromUri('//Alice', { name: 'Alice test account' });
      let agent = new TrackBackAgent();
      let result = await agent.save(
        account, 
        didDocument, 
        didDocumentMetadata, 
        didResolutionMetadata, 
        didRef,
        publicKeys
      );
      expect(result).to.equal({
          "Error": true,
          "Message": "dispatchError",
         });
    });
  });
})
