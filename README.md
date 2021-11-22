[![ExpTrackback Logo](https://user-images.githubusercontent.com/2051324/127407635-236f8a7a-4ca6-410a-9fc4-add396743cfa.png)](https://trackback.co.nz/)

[![TrackBack VC SDK](https://img.shields.io/badge/trackback--vc-0.0.1--alpha-blue)](https://github.com/trackback-blockchain/trackback-verifiable/tree/main/packages/trackback-vc)
[![TrackBack Key SDK 0.0.1-alpha.6](https://img.shields.io/badge/trackback--key-0.0.1--alpha-green)](https://github.com/trackback-blockchain/trackback-verifiable/tree/main/packages/trackback-key)
[![TrackBack DID SDK](https://img.shields.io/badge/trackback--did-0.0.1--alpha-9cf)](https://github.com/trackback-blockchain/trackback-verifiable/tree/main/packages/trackback-did)
[![TrackBack Agent SDK](https://img.shields.io/badge/trackback--trackback--agent-0.0.1--alpha-yellow)](https://github.com/trackback-blockchain/trackback-verifiable/tree/main/packages/trackback-agent)

[![TrackBack VC SDK Build](https://img.shields.io/badge/build-pass-blueviolet)](https://github.com/trackback-blockchain/trackback-verifiable/tree/main/packages)
[![Node Version](https://img.shields.io/badge/nodejs-14.0.0+-8ca)](https://nodejs.org/es/blog/release/v14.0.0)
[![Lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

## SDKs for Verifiable Credentials, Presentations, Keys and Decentralised Identifiers

## IMPORTANT! 
* This is a minimum viable product suite with limited functionality.
* Please do not use this for production

## Prerequisites
* BuildScripts 
* Working with NodeJS 14.0.0 + in either Linux or Windows

## The Big Picture ( MVP Release )
![Architecture](Architecture.png)

## Mono repo packages
Please go through the individual repositories 
* [trackback-agent](./packages/trackback-agent)
* [trackback-did](./packages/trackback-did)
* [trackback-key](./packages/trackback-key)
* [trackback-vc](./packages/trackback-vc)


### Setup project
```bash
yarn config set workspaces-experimental true
npm run bootrap
```

### Tests
To run all tests for the project

```bash
npm run test
```

### Builder

```bash
npm run build
```

### Clean and rebuild
```bash
find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +
yarn install
```
### Generate documentation
```bash
sudo npm i -g typedoc # needs to do only once
typedoc --darkHighlightTheme dark-plus --tsconfig ./tsconfig.json
```