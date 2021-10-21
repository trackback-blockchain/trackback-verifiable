import { assert } from "chai";
import { TrackBackAgent } from "../../src/agent";
import { Keyring } from "@polkadot/api";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import  { toUint8Array, transformParams, uriToHex } from "../../src/agent/helpers";

import sinon from 'sinon';

import { Procedure } from "../../src/agent/procedure";
import { TrackBackModules, TrackBackCallables } from "../../src/agent/enums";

const didDocument = {
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/ed25519-2020/v1",
  ],
  id: "did:trackback.dev:0xaseb1b3",
  assertionMethod: [
    {
      id: "did:trackback.dev:dia-0x12345678999",
      type: "Ed25519VerificationddKey2020",
      controller: "did:trackbackdev:dia-0x1234567890",
      publicKeyMultibadfddesse: "publicKey",
    },
  ],
};

const didDocumentMetadata = {
  key1: "value1",
  key2: "value2",
};

const didResolutionMetadata = {
  key1: "value1",
  key2: "value2",
};

const publicKeys = [
  "zFRxW9CSU1o8+zeW7im8ukVIhnxlSBYJ9x3ISBq6h2M=",
  "vaDp3EX2xwXak9Js3wG7bzfzREajPaK5PxMPWbiyFWk=",
  "5hglsxvy06HhqAeHoGmVO/08Coy8fce/ATYDS9SnEvM=",
  "hDxfP9altb1eHt4AwIwNpF78YWc+fYvpu/e/jRSgPFE=",
];

const didRef = "https://ipfs.trackback.dev:8080/ipfs/did-document-cid";

let stub: any;
let keyring: any;
let account: any;
let agent: any;

describe('DID operation tests', () => {
  beforeEach(() => {
    stub = sinon.stub(Procedure.prototype, "dispatch").callsFake(() => {
      return Promise.resolve(null)
    });
    keyring = new Keyring({ type: 'sr25519' });
    account = keyring.addFromUri('//Alice', { name: 'Alice test account' });
    agent = new TrackBackAgent(null);
  });

  afterEach(() => {
    sinon.restore();
    keyring = null;
    account = null;
    agent = null;
  });

  it("Should call dispatch once when creating a DID Document", async () => {
    await cryptoWaitReady().then(async () => {
      await agent.procedure.constructDIDDocument(
        account,
        didDocument,
        didDocumentMetadata,
        didResolutionMetadata,
        didRef,
        publicKeys
      );

      const didDoc = toUint8Array(didDocument);
      const didDocMetadata = toUint8Array(didDocumentMetadata);
      const didDocRes = toUint8Array(didResolutionMetadata);

      const didURI = uriToHex(didDocument.id);

      const inputParams = [
        didDoc,
        didDocMetadata,
        didDocRes,
        account.address,
        didURI,
        didRef,
        publicKeys,
      ];

      const paramFields = [true, true, true, true, true, true, true];

      const transformed = transformParams(paramFields, inputParams);
      assert(
        stub.calledOnceWith(
            account, 
            TrackBackModules.DIDModule,
            TrackBackCallables.DIDInsert,
            transformed
        )
      );
    });
  });

  it("Should call dispatch once when updating a DID Document", async () => {
    await cryptoWaitReady().then(async () => {
      await agent.procedure.updateDIDDocument(
        account,
        didDocument,
        didDocumentMetadata,
        didResolutionMetadata,
        didRef,
        publicKeys
      );

      const transformed = transformParams(
        [true, true, true, true, true], 
        [uriToHex(didDocument.id), toUint8Array(didResolutionMetadata), toUint8Array(didDocumentMetadata), didRef, publicKeys
      ]);

      assert(
        stub.calledOnceWith(
            account, 
            TrackBackModules.DIDModule,
            TrackBackCallables.DIDUpdate,
            transformed
        )
      );
    });
  });
})
