
[![ExpTrackback Logo](https://user-images.githubusercontent.com/2051324/127407635-236f8a7a-4ca6-410a-9fc4-add396743cfa.png)](https://trackback.co.nz/)

[![TrackBack Key SDK 0.0.1-alpha.6](https://img.shields.io/badge/trackback--key-0.0.1--alpha-green)](https://github.com/trackback-blockchain/trackback-verifiable/tree/main/packages/trackback-key)
[![TrackBack Key SDK 0.0.1-alpha.6](https://img.shields.io/badge/build-pass-blueviolet)](https://github.com/trackback-blockchain/trackback-verifiable/tree/main/packages)
[![Node Version](https://img.shields.io/badge/nodejs-14.0.0+-8ca)](https://nodejs.org/es/blog/release/v14.0.0)
[![Lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

# TrackBack DID Key SDK

Implementation of JSON Web Key 2020 <https://w3c-ccg.github.io/lds-jws2020/>

Based on <https://github.com/w3c-ccg/lds-jws2020>

## Installation

```bash
yarn install
```

## Usage

### importing DID builder and resolver

ES Modules import

```javascript

import { JsonWebKey2020 } from '@trackback/key'

```

CommonJS import

```javascript

const { JsonWebKey2020 } = require('@trackback/key');

```

## Example

### Generate keypair

```javascript

const keyPair = await JsonWebKey2020.generate();

// {
//   id: 'did:trackback:key:...-pXbFqo#...-pXbFqo',
//   type: 'JsonWebKey2020',
//   controller: 'did:trackback:key:...-pXbFqo',
//   publicKeyJwk: {
//     crv: 'Ed25519',
//     x: 'THLsqR-...-3FDg',
//     kty: 'OKP',
//     alg: 'EdDSA',
//   },
//   privateKeyJwk: {
//     crv: 'Ed25519',
//     d: '..-URkyPqyYhTc',
//     x: 'THLsqR-...-3FDg',
//     kty: 'OKP',
//     alg: 'EdDSA',
//   },
// }



```

### Sign messages

```javascript

const signer = keyPair.signer();
const signature = await signer.sign({message:"test"});

```

### Verify signature

```javascript

const message = {...}

const signer = keyPair.signer();
const signature = await signer.sign(message);

const verifier = keyPair.verifier();
const verified = await verifier.verify({ data: message, signature });

// true / false
```
