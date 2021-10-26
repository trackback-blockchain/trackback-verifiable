<p>
  <a href="https://trackback.co.nz/">
    <img src="https://user-images.githubusercontent.com/2051324/127407635-236f8a7a-4ca6-410a-9fc4-add396743cfa.png" alt="TrackBack"></a>
</p>

## SDKs for Verifiable Credentials, Presentations, Keys and Decentralised Identifiers

<a href="https://github.com/trackback-blockchain/trackback-verifiable/tree/main/packages/trackback-agent" target="_blank">
    <img src="https://img.shields.io/badge/trackback--agent-0.0.1--alpha.0-yellow" alt="TrackBack Agent SDK 0.0.1-alpha.0">
</a>
<a href="https://github.com/trackback-blockchain/trackback-verifiable/tree/main/packages/trackback-did" target="_blank">
    <img src="https://img.shields.io/badge/trackback--did-0.0.1--alpha.0-9cf" alt="TrackBack DID SDK 0.0.1-alpha.0">
</a>
<a href="https://github.com/trackback-blockchain/trackback-verifiable/tree/main/packages/trackback-key" target="_blank">
    <img src="https://img.shields.io/badge/trackback--key-0.0.1--alpha.0-green" alt="TrackBack Key SDK 0.0.1-alpha.0">
</a>
<a href="https://github.com/trackback-blockchain/trackback-verifiable/tree/main/packages/trackback-vc" target="_blank">
    <img src="https://img.shields.io/badge/trackback--vc-0.0.1--alpha.0-blue" alt="TrackBack Verifiable Credentials SDK 0.0.1-alpha.0">
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

This is a minimum viable product suite. Please do not use this for production

## Prerequisites
* SDKs has been tested on Ubuntu and Mint Linux.
* Works NodeJS 14.0.0 +

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