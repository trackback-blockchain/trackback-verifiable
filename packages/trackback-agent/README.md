<p>
  <a href="https://trackback.co.nz/">
    <img src="https://user-images.githubusercontent.com/2051324/127407635-236f8a7a-4ca6-410a-9fc4-add396743cfa.png" alt="TrackBack"></a>
</p>

# TrackBack Agent SDK
* Create, Revoke, Resolve, Update DIDs
* Connects with TrackBack chain
* Store DID documents in a Decentralised file store ( IPFS for MVP stage) 

### Please refer`agent/tests` 
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