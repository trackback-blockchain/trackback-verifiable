import { JsonWebKey2020 } from './../src/JsonWebKey2020';
import { expect } from 'chai';


const test_ed25519_keypair = {
  id: 'did:trackback:key:OHt8a2XnpR3MsW1XheYV8OJLOm6WWMEahxxp-pXbFqo#OHt8a2XnpR3MsW1XheYV8OJLOm6WWMEahxxp-pXbFqo',
  type: 'JsonWebKey2020',
  controller: 'did:trackback:key:OHt8a2XnpR3MsW1XheYV8OJLOm6WWMEahxxp-pXbFqo',
  publicKeyJwk: {
    crv: 'Ed25519',
    x: 'THLsqR-vqObPJUj93R6lvATMOsUe2n0Y6P07dZ-3FDg',
    kty: 'OKP'
  },
  privateKeyJwk: {
    crv: 'Ed25519',
    d: 'LnbtxtqhipweoTZb2v7_Zuj_HXYqcBK-URkyPqyYhTc',
    x: 'THLsqR-vqObPJUj93R6lvATMOsUe2n0Y6P07dZ-3FDg',
    kty: 'OKP'
  }
}

// based on https://github.com/w3c-ccg/lds-jws2020

describe('generate', () => {

  it('default is ed25519', async () => {
    const key = await JsonWebKey2020.generate();
    // console.log(key)
    expect((key.publicKeyJwk as any).kty).to.equal('OKP');
    expect((key.publicKeyJwk as any).crv).to.equal('Ed25519');

  });

  it('supports RSA 2048 signature:PS256', async () => {
    const key = await JsonWebKey2020.generate(
      "did:example:controller",
      "PS256",
      { modulusLength: 2048 }
    );

    expect((key.publicKeyJwk as any).kty).to.equal('RSA');

  });

  it('supports EC	crv:P-384	sinature: ES384	', async () => {
    const key = await JsonWebKey2020.generate(
      "did:example:controller",
      "ES384",
      { crv: 'P-384' }
    );

    expect((key.publicKeyJwk as any).kty).to.equal('EC');
    expect((key.publicKeyJwk as any).crv).to.equal('P-384');

  });

});

describe('import tests', () => {
  it('from key', async () => {
    const key = JsonWebKey2020.from({ ...test_ed25519_keypair });
    expect((key.publicKeyJwk as any).kty).to.equal('OKP');
    expect((key.publicKeyJwk as any).crv).to.equal('Ed25519');
  });

  it('fingerprint', async () => {
    const fingerprint = await JsonWebKey2020.fingerprint(test_ed25519_keypair.publicKeyJwk);
    expect(fingerprint).to.equal('OHt8a2XnpR3MsW1XheYV8OJLOm6WWMEahxxp-pXbFqo');
  });

});

describe('sign test', () => {
  it('sign', async () => {
    const testMSG = { "test": "asss" }
    const sig = 'xo6LMkRMeNZj477e2hNn-tBPPyZObXTbfxamkjfaSNdgbnheACYBIPxbgtJza7s9kHpJzEJcYfiKPbpq_wBeBg';
    
    const key = JsonWebKey2020.from({ ...test_ed25519_keypair });
    const signer = key.signer();
    const signature = await signer.sign(testMSG);

    expect(signature.split('.')[2]).to.equal(sig)
  });
});
