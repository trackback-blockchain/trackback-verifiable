import { assert, expect } from "chai";
import { TrackBackAgent } from "../../src/agent";
import { Keyring } from "@polkadot/api";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import  { toUint8Array, transformParams, uriToHex } from "../../src/agent/helpers";

import sinon from 'sinon';

import { Procedure } from "../../src/agent/procedure";
import { TrackBackModules, TrackBackCallables } from "../../src/agent/enums";
import { Connector, DecentralisedFileStoreConnector } from "../../src/agent/connection";

const savedDIDStructure = {
  did_resolution_metadata: {
    DIDResolutionMedatadataKey1: "DIDResolutionMedatadataValue1",
  },
  did_document_metadata: {
    DIDMetadataKey1: "DIDMetadataValue1",
  },
  block_number: 15096,
  block_time_stamp: 1634897784,
  updated_timestamp: 1634897784,
  did_ref: "https://ipfs.trackback.dev:8080/ipfs/Qma3fM3VBKPXt7peEeJCAG25s7QMUwvLvGDwFikonZbPff",
  sender_account_id: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
  public_keys: [
    "cdET4zImQD0JnzvZ63V9q4MAI7paQlprfxOXDjaMxIo=",
    "692RCpjogX/ypSL6RHflJ4zRcn0qoidBfb7b+rw3rnM=",
    "IX+Er8hGzerTzB1g2Ufxu2dQP/9fDR4kKe1Q0BaUgWk=",
  ],
  did_document: {
    "@context": [
      "https://www.w3.org/ns/did/v2",
      "https://w3id.org/security/suites/ed2551s9-2020/v1",
    ],
    id: "did:trackback.dev:0x2a674c8ef2bc79f13faf22d4165ac99efc2cabe6e3194c0a58336fed7c56b1b3",
    assertionMethod: [
      {
        id: "did:trackback.dev:dia-0x12345678999",
        type: "Ed25519VerificationKey2020",
        controller: "did:trackback.dev:dia-0x1234567890",
        publicKeyMultibase: "AAAAC3NzaCfbdgdsssssss1lZDI1NTE5AAAAIIFraDC1HgOAg22wwwyaRuFvCTcL+N3yeBH/tN+zUI",
      },
    ],
  },
};

const desDIDStructure = {
  "didDocument": {
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/ed25519-2020/v1"
  ],
  "id": "did:0xfac17a:0x68b5d6033f8958558cc0bb48328bb9ba0651078b3f69eee533a2dfdba75965f2",
  "assertionMethod": [
      {
        "id": "did:trackback.dev:dia-0x12345678999",
        "type": "Ed25519VerificationKey2020", 
        "controller": "did:trackback.dev:dia-0x1234567890",
        "publicKeyMultibase": "AAAAC3NzaC1lZDI1NTE5AAAAIIFraDC1HgOAg22FdjngyaRuFvCTcL+N3yeBH/tN+zUI"
      }
    ]
  },
  "proof": "1234",
  "senderTimeStamp": "2021-06-20",
  "publicKey": "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILgl183qensmRV8tKBqM/E2GSEuQGLV883tAecMhuNUu"
  };

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
let decentralisedStorageServiceStubPostData: any;
let decentralisedStorageServiceStubGetData: any;

describe('DID operation tests', () => {
  beforeEach(() => {

    stub = sinon.stub(Procedure.prototype, "dispatch").callsFake(() => {
      return Promise.resolve(null)
    });

    decentralisedStorageServiceStubPostData = sinon.stub(DecentralisedFileStoreConnector.prototype, "postData").callsFake(() => {
      return Promise.resolve("https://decentralisedFileStoreURL/api/CID");
    });

    decentralisedStorageServiceStubGetData = sinon.stub(DecentralisedFileStoreConnector.prototype, "getData").callsFake(() => {
      return Promise.resolve(savedDIDStructure);
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

  it("Should call dispatch once when updating a DID Document", async () => {

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
      [
        uriToHex(didDocument.id), toUint8Array(didResolutionMetadata), toUint8Array(didDocumentMetadata), didRef, publicKeys
      ]
    );

    assert(
      stub.calledOnceWith(
          account, 
          TrackBackModules.DIDModule,
          TrackBackCallables.DIDUpdate,
          transformed
      )
    );

  });

  it("Should save a record on IPFS or a Decentralised data store", async () => {
      agent = new TrackBackAgent(null);
      let result = await agent.procedure.saveToDistributedStorage(desDIDStructure, null);
      assert(
        decentralisedStorageServiceStubPostData.calledOnceWith(desDIDStructure, null
        )
      );
      expect(result).to.equal("https://decentralisedFileStoreURL/api/CID");
  });

  /**
   * This test has been skipped though the function has been tested using integration tests
   * TODO: Mock Polkadot Crypto await functionality
   */
  it.skip("Should fetch the DID Document from CID", async () => {
    await cryptoWaitReady().then(async () => {
      agent = new TrackBackAgent(new Connector());
      let result = await agent.procedure.resolve("did:0xfac17a:0x68b5d6033f8958558cc0bb48328bb9ba0651078b3f69eee533a2dfdba75965f2");
      assert(
        decentralisedStorageServiceStubGetData.calledOnceWith(desDIDStructure, null)
      );
      expect(result).to.equal({
        did_resolution_metadata: {
          DIDResolutionMedatadataKey1: "DIDResolutionMedatadataValue1",
        },
        did_document_metadata: {
          DIDMetadataKey1: "DIDMetadataValue1",
        },
        block_number: 15096,
        block_time_stamp: 1634897784,
        updated_timestamp: 1634897784,
        did_ref: "https://ipfs.trackback.dev:8080/ipfs/Qma3fM3VBKPXt7peEeJCAG25s7QMUwvLvGDwFikonZbPff",
        sender_account_id: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
        public_keys: [
          "cdET4zImQD0JnzvZ63V9q4MAI7paQlprfxOXDjaMxIo=",
          "692RCpjogX/ypSL6RHflJ4zRcn0qoidBfb7b+rw3rnM=",
          "IX+Er8hGzerTzB1g2Ufxu2dQP/9fDR4kKe1Q0BaUgWk=",
        ],
        did_document: {
          "@context": [
            "https://www.w3.org/ns/did/v2",
            "https://w3id.org/security/suites/ed2551s9-2020/v1",
          ],
          id: "did:trackback.dev:0x2a674c8ef2bc79f13faf22d4165ac99efc2cabe6e3194c0a58336fed7c56b1b3",
          assertionMethod: [
            {
              id: "did:trackback.dev:dia-0x12345678999",
              type: "Ed25519VerificationKey2020",
              controller: "did:trackback.dev:dia-0x1234567890",
              publicKeyMultibase: "AAAAC3NzaCfbdgdsssssss1lZDI1NTE5AAAAIIFraDC1HgOAg22wwwyaRuFvCTcL+N3yeBH/tN+zUI",
            },
          ],
        },
      });
    });    
  });
})
