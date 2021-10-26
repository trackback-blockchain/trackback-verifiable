# TrackBack Agent
* Create, Revoke, Resolve, Update DIDs
* Connects with TrackBack chain
* Store DID documents in a Decentralised file store ( IPFS for MVP stage) 
## DID Operations 
* Reference :- https://www.w3.org/TR/did-core/
 
#### Create a DID
```javascript
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
### Revoke a DID
### Update a DID
* To update a DID Document, you need to grab the DID information and meta data from resove method
 

```javascript
let did_uri = "did:0xfac17a:0x68b5d6033f8958558cc0bb48328bb9ba0651078b3f69eee533a2dfdba75965f2"
let agent = new TrackBackAgent(new Connector());
await agent.procedure.resolve(did_uri);
```