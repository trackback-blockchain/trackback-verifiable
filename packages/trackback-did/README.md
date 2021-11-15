<p>
  <a href="https://trackback.co.nz/">
    <img src="https://user-images.githubusercontent.com/2051324/127407635-236f8a7a-4ca6-410a-9fc4-add396743cfa.png" alt="TrackBack"></a>
</p>

# TrackBack DID SDK

<a href="https://github.com/trackback-blockchain/trackback-verifiable/tree/main/packages/trackback-did" target="_blank">
    <img src="https://img.shields.io/badge/trackback--did-0.0.1--alpha.0-9cf" alt="TrackBack DID SDK 0.0.1-alpha.0">
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

The library is intended to be used as a common template for resolving a DID.

Supports [Decentralized Identifiers](https://w3c.github.io/did-core/#identifier) spec.


## IMPORTANT!

* This is a minimum viable product suite with limited functionality.
* Please do not use this for production
  
## Installation

```bash
yarn install
```

## Usage

### importing DID builder and resolver

ES Modules import

```javascript

import { Builder, DIDResolver } from '@trackback/did'

```

CommonJS import

```javascript

const { Builder, DIDResolver } = require('@trackback/did');

```

## Example

Following shows how to resolve a DID using different libraries

```javascript
const { DIDResolver } = require('@trackback/did');
const { Connector } = require('@trackback/agent');

const customWebResolver = {resolve:(didUri)=>{...}}

const connector = new Connector();
const agent = new TrackBackAgent(connector);

const resolver = new DIDResolver();

resolver.add('web', customWebResolver);
resolver.add('trackback', agent.procedure);

const result: DIDResolutionResult = await resolver.resolve(
'did:web:test1234'
);

// {
//   didResolutionMetadata: {...},
//   didDocument: {...},
//   didDocumentMetadata: {...},
// };

```
