<p>
  <a href="https://trackback.co.nz/">
    <img src="https://user-images.githubusercontent.com/2051324/127407635-236f8a7a-4ca6-410a-9fc4-add396743cfa.png" alt="TrackBack"></a>
</p>

# TrackBack Agent SDK

<p>
  <a href="https://trackback.co.nz/">
    <img src="https://user-images.githubusercontent.com/2051324/127407635-236f8a7a-4ca6-410a-9fc4-add396743cfa.png" alt="TrackBack"></a>
</p>

<a href="https://github.com/trackback-blockchain/trackback-verifiable/tree/main/packages/trackback-agent" target="_blank">
    <img src="https://img.shields.io/badge/trackback--agent-0.0.1--alpha.0-yellow" alt="TrackBack Agent SDK 0.0.1-alpha.0">
</a>
<a href="" target="_blank">
    <img src="https://img.shields.io/badge/build-pass-blueviolet" alt="Codeshare 3.0.0">
</a>
<a href="https://nodejs.org/es/blog/release/v14.0.0/" target="_blank">
    <img src="https://img.shields.io/badge/nodejs-14.0.0+-8ca" alt="NodeJS 14.0.0">
</a>
<a href="https://lerna.js.org/" target="_blank">
    <img src="https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg" alt="TrackBack Verifiable Credentials SDK 0.0.1-alpha.0">
</a>



# TrackBack Agent SDK
* Create, Revoke, Resolve, Update DIDs
* Connects with TrackBack chain
* Store DID documents in a Decentralised file store ( IPFS for MVP stage)

## IMPORTANT! 
* This is a minimum viable product suite with limited functionality.
* Do not use this for productionise code or for an end product
* Please view Limitations

# Limitations
## The following features are not available in this minimum viable SDK
* Zero Knowledge Proofs
* Batch insert / update of DIDs
* DID revocation - the DID document will be available on IPFS without DID meta information
* Support for JSON-LD
* Single Sign On (using Self Sovereign Identity)
* Saving a cryptographical print of a verifiable credential on chain
* Multiple authentication
* DID delegation is incomplete , only the nominated parties can modify a DID document
* DID delegation functionality over a verifiable credential will be delivered after MVP stage

## Miscellaneous 
* You may see warning messages when creating DIDs
* Only works with already created accounts on chain 



## Issue and Verify credentials

## Requirements

* Install nodejs 14.0.0  or above.
* Install follwoing dependencies. 
```javascript
sudo npm i -g ts-node
npm install -g typescript
nvm use 14
npm install @trackback/agent
```
### Constructing SSI Elements
<details>
  <summary>Create an <b>Issuer</b></summary>

  ```javascript
import {CredentialIssuer,Connector, createAccount, TrackBackAgent} from '@trackback/agent';

async function createAnIssuer() {
    // Create a Connector object.
    const connector = new Connector();

    // Initialise the `TrackBackAgent` with a connector instance.
    const agent = new TrackBackAgent(connector);
    
    // An Issuer needs an active account on TrackBack Blockchain
    // Please use the default account for this MVP release
    // Functionality will be added to create ad use your own objects in future releases.
    const account = await connector.getDefaultAccount();

    // A valid context is required to persist an object to the chain 
    const context = {
        agent,
        account: account
    }

    // Creates an issuer
    const issuer = await CredentialIssuer.build();

    // Saves a DID Document
    await issuer.save(context, {"didDocumentMetadata": "docMeta"}, {"didResolutionMetadata": "resolutionMeta"});

    let resolevedDIDDocument = await agent.procedure.resolve(issuer.toDidDocument().id);
    /**  resolevedDIDDocument
     * {
            did_resolution_metadata: { hello: 'resolutionMeta' },
            did_document_metadata: { hello: 'docMeta' },
            block_number: 218812,
            block_time_stamp: 1635477636,
            updated_timestamp: 1635477636,
            did_ref: 'https://ipfs.trackback.dev:8080/ipfs/QmdH3JyxJ1A45goKAt18ja3TX67ea4Vz2NTyLkLXEQYTk8',
            sender_account_id: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
            public_keys: [ '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY' ],
            did_document: {
                '@context': [ 'https://www.w3.org/ns/did/v1' ],
                id: 'did:trackback:e97aaebd-c221-44d6-925f-f73493eec3dd',
                verificationMethod: [ [Object] ]
            }
            }
            {
            header: {
                alg: 'EdDSA',
                typ: 'JWT',
                kid: 'did:trackback:key:JsonWebKey2020:ZpM9EIlXv2Yj9F1IaIS-S1-BkSrXIq8ad2rpAffDDlg#ZpM9EIlXv2Yj9F1IaIS-S1-BkSrXIq8ad2rpAffDDlg'
            },
            payload: {
                nbf: 1635477651,
                iss: 'did:trackback:e97aaebd-c221-44d6-925f-f73493eec3dd',
                vp: {
                '@context': [Array],
                type: [Array],
                verifiableCredential: [Array]
                }
            },
            signature: 'PdPWI_J88vokw68_APAFh3BU7Go6grabOGj3SAtFbfOwpJCz0yyAh7xR7rdZIw7lhCHwPfB6-25QFYsUEehACw'
            }
     * */
}

  ```
</details>

<details>
  <summary>Create a <b>Verifiable Credential</b> and a <b>Verifiable Credential Presentation</b></summary>

  ```javascript
import {CredentialIssuer,Connector, createAccount, TrackBackAgent} from '@trackback/agent';

async function verifiableCredential(credentialData: any) {


    const connector = new Connector();
    const agent = new TrackBackAgent(connector);
    
    const account = await connector.getDefaultAccount();

    const context = {
        agent,
        account: account
        }
    const issuer = await CredentialIssuer.build();
    await issuer.save(context, {"hello": "docMeta"}, {"hello": "resolutionMeta"});

    /*
    Ppopulate Credential subject with data
    Reference :- https://www.w3.org/TR/vc-data-model/#example-1-a-simple-example-of-a-verifiable-credential
    "credentialSubject": {
        
        "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
        
        "alumniOf": {
        "id": "did:example:c276e12ec21ebfeb1f712ebc6f1",
        "name": [{
            "value": "Example University",
            "lang": "en"
        }, {
            "value": "Exemple d'Université",
            "lang": "fr"
        }]
        }
    },
    
    */
    const credential = {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential'],
        issuanceDate: '2010-01-01T19:23:24Z',
        credentialSubject: credentialData, // default {}
        issuer: issuer.id,
    };

    // Creates a JWT
    const jwt = await issuer.createVerifiableCredentials(credential);

    // Creates a JWT presentation
    const jwtPresentation = await issuer.createVerifiablePresentation([jwt], issuer.keypair);

    // console.log("JWT Presentation " +  jwtPresentation)
    let decode = CredentialVerifier.decodeJWT(jwtPresentation);

    // Prints decoded JWT presentation
    console.log(decode);
}
```
</details>


<details>
  <summary>Verification Process</summary>
     
  ```javascript
/*
IssuerA Creates a Credential
*/
async function createCredentials() {
    
    // Creates a connector object
    const connector = new Connector();
    // Creates the TrackBack Agent
    const agent = new TrackBackAgent(connector);
    
    // Creates the defualt account for the issuer
    // `Alice` if there's no mnemonic
    // The passing mnemonic must be a valid account on TrackBack
    // For the MVP please use either Alice or Bob since we are finalising our token
    // economic and account model
    const account = await connector.getDefaultAccount();

    // Creates the issuer's context
    const context = {
        agent,
        account: account
    }

    // Create Issuer's keypair
    const IsserA = await CredentialIssuer.build();
    // Saves the Issuer's DID
    // This needs to be done only once per issuer
    // Do not create new issuers per credentials
    await IsserA.save(context, {"hello": "docMeta"}, {"hello": "resolutionMeta"});
    
    // Issuer creates a credential
    // Pass teh required data as JSON to `credentialSubject: {},`
    const credential = {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential'],
        issuanceDate: '2010-01-01T19:23:24Z',
        credentialSubject: {},
        issuer: IsserA.id,
    };
    const jwt = await IsserA.createVerifiableCredentials(credential);
    
    // Issuer creates a verifiable credential presentation 
    const jwtPresentation = await IsserA.createVerifiablePresentation([jwt], IsserA.keypair);

    // The above jwtPresentation can reside on a wallet / website or in a database

  ```
  A verifier verifies the `JWT`

  ```javascript
  async function verify(jwtPresentation) {
    // Creates a connector object
    const connector = new Connector();
    // Creates the TrackBack Agent
    const agent = new TrackBackAgent(connector);
     // Create a verifier
    let verifier = new CredentialVerifier();

    // For the MVP please use an Account available on TrackBack Chain.
    const accountB = await connector.getDefaultAccount("Bob");
    const verifierContext = {
        agent,
        account: accountB
    }

    const r = await verifier.verifyPresentation(jwtPresentation, verifierContext);
    console.log(r); // True | False
}
  ```


</details>

 

## Usage

## Installation

```bash
npm install @trackback/agent

## or yarn 
yarn add @trackback/agent

```

## Importing

ES Modules import

```javascript

import { TrackBackAgent } from '@trackback/agent'

```

CommonJS import

```javascript

const { TrackBackAgent } = require('@trackback/agent');

```


## DID Operations 
* Reference :- https://www.w3.org/TR/did-core/
 
#### Create a DID
* The DID Document must be saved on IPFS
```javascript
/*
* `saveToDistributedStorage returns the `cid`
* Please Include this value as the didRef when calling the constructDIDDocument and updateDIDDocument methods.
*/
agent = new TrackBackAgent(new Connection());
let result = await agent.procedure.saveToDistributedStorage(desDIDStructure, null);
```
```javascript
/*
* Returns Promise<ExtrinsicResults>
* ExtrinsicResults 
export type ExtrinsicResults = {
  [key: string]: any;
} | null;
*/
let agent = new TrackBackAgent(new Connector());
await agent.procedure.constructDIDDocument(
    account,
    didDocument,
    didDocumentMetadata,
    didResolutionMetadata,
    didRef,
    publicKeys
);
```
#### Resolve a DID
```javascript
let did_uri = "did:0xfac17a:0x68b5d6033f8958558cc0bb48328bb9ba0651078b3f69eee533a2dfdba75965f2"
let agent = new TrackBackAgent(new Connector());
await agent.procedure.resolve(did_uri);
```

### Revoke a DID
```javascript
/*
* Returns Promise<ExtrinsicResults>
* ExtrinsicResults 
export type ExtrinsicResults = {
  [key: string]: any;
} | null;
*/
let did_uri = "did:0xfac17a:0x68b5d6033f8958558cc0bb48328bb9ba0651078b3f69eee533a2dfdba75965f2"
let agent = new TrackBackAgent(new Connector());
await agent.procedure.revoke(
    account,
    did_uri
);
```
### Update a DID
* To update a DID Document, you need to grab the DID information and meta data from resove method
 
```javascript
let did_uri = "did:0xfac17a:0x68b5d6033f8958558cc0bb48328bb9ba0651078b3f69eee533a2dfdba75965f2"
let agent = new TrackBackAgent(new Connector());
await agent.procedure.resolve(did_uri);
```

```javascript
/*
* Returns Promise<ExtrinsicResults>
* ExtrinsicResults 
export type ExtrinsicResults = {
  [key: string]: any;
} | null;
*/
let agent = new TrackBackAgent(new Connector());
await agent.procedure.updateDIDDocument(
    account,
    didDocument,
    didDocumentMetadata,
    didResolutionMetadata,
    didRef,
    publicKeys
);
```

## Create W3C Verifiable Credentials

Following steups to create and sign W3C credential as jwt

### Sign credentials

```javascript

import { CredentialIssuer } from '@trackback/agent'
import { createAccount } from '@trackback/agent/account'

// initialize the agent
const agent = new TrackBackAgent(new Connector());

// create context
const context = {
  agent,
  account: createAccount()
}

//initialize credential issuer
const issuer = await CredentialIssuer.build();

// save did document to ipfs
issuer.save(context)

const credential = {
              '@context': ['https://www.w3.org/2018/credentials/v1'],
              type: ['VerifiableCredential'],
              issuanceDate: '2010-01-01T19:23:24Z',
              credentialSubject: {},
              issuer: issuer.id,
          };

const jwtCredential = await issuer.createVerifiableCredentials(credential)

// jwt


```

### Verify credentials

```javascript

// initialize the agent
const agent = new TrackBackAgent(new Connector());

// create context
const context = {
  agent,
  account: createAccount()
}

const verifier = new CredentialVerifier();

// ... create jwtCredential


 const r = await verifier.verifyCredentials(jwtCredential, context);


 // true/false

```

## Create W3C Verifiable Presentation

### Sign presentation

Following steups to create and sign W3C Presentation as jwt

```javascript

import { CredentialIssuer } from '@trackback/agent'
import { createAccount } from '@trackback/agent/account'


//initialize credential issuer
const issuer = await CredentialIssuer.build();

const keyPair = issuer.keypair

const jwtPresentaion = await issuer.createVerifiablePresentation([
  jwtCredential
], keyPair)

// jwt


```

### Verify presentation

Context is require to retrive verification for credentials

```javascript

// initialize the agent
const agent = new TrackBackAgent(new Connector());

// create context
const context = {
  agent,
  account: createAccount()
}

const verifier = new CredentialVerifier();

// ... create jwtPresentation


 const r = await verifier.verifyPresentation(jwtPresentation, context, issuer.keypair)

 // true/false

```

## With custom chain settings

You can use custom url with sdk.

More info on `options` : <https://polkadot.js.org/docs/api/start/rpc.custom>

```javascript

const { DefaultOptions } = require('@trackback/agent')
const options = {
  url: 'ws://custom.node.example.com', // custom node url ws[s]://custom.node.example.com:9944
  options: {...DefaultOptions.options} // using trackback defaults
}

const agent = new TrackBackAgent(new Connector(options));


```
