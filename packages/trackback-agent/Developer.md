# TrackBack SDK Developer Guide

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

async function main() {
    // Create a Connector object.
    const connector = new Connector()

    // Initialise the `TrackBackAgent` with a connector instance.
    const agent = new TrackBackAgent(connector);
    
    // An Issuer needs an active account on TrackBack Blockchain
    // Please use the default account for this MVP release
    // Functionality will be added to create ad use your own objects in future releases.
    const account = await connector.getDefaultAccount()

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
  <summary>Create a verifiabel credential</summary>

  ```javascript
import {CredentialIssuer,Connector, createAccount, TrackBackAgent} from '@trackback/agent';

async function main() {
    // Create a Connector object.
    const connector = new Connector()

    // Initialise the `TrackBackAgent` with a connector instance.
    const agent = new TrackBackAgent(connector);
    
    // An Issuer needs an active account on TrackBack Blockchain
    // Please use the default account for this MVP release
    // Functionality will be added to create ad use your own objects in future releases.
    const account = await connector.getDefaultAccount()

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