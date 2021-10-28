import { expect } from 'chai';
import { check } from '../../src/credential/check';
import { VC } from '../../src/';

import { JsonWebKey2020 } from '@trackback/key';

describe('VC Tests', () => {
  describe('Check credentials Tests', () => {
    it('validate credential @context', () => {
      expect(() => check({})).to.throw(
        Error,
        'Credentials must have a "@context" property'
      );
    });

    it('Credentials first item is a URI: https://www.w3.org/2018/credentials/v1', () => {
      expect(() =>
        check({
          '@context': [''],
        })
      ).to.throw(
        Error,
        'Credentials first item is a URI with the value https://www.w3.org/2018/credentials/v1'
      );
    });

    it('Credentials should have a type attribute', () => {
      expect(() =>
        check({
          '@context': ['https://www.w3.org/2018/credentials/v1'],
        })
      ).to.throw(Error, 'Credentials must have "type"');
    });

    it('Credentials should have a type (array) attribute ', () => {
      expect(() =>
        check({
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: '',
        })
      ).to.throw(Error, 'Credentials must have "type"');
    });

    it('Credentials should have a type VerifiableCredential ', () => {
      expect(() =>
        check({
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['TestCredential'],
        })
      ).to.throw(Error, '"type" must have VerifiableCredential');
    });

    it('Credentials should have a type credentialSubject ', () => {
      expect(() =>
        check({
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential'],
        })
      ).to.throw(Error, 'Credentials must have "credentialSubject"');
    });

    it('Credentials should have a type issuer ', () => {
      expect(() =>
        check({
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential'],
          credentialSubject: {},
        })
      ).to.throw(Error, 'Credentials must have "issuer"');
    });

    it('Credentials should be valid ', () => {
      expect(
        check({
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential'],
          credentialSubject: {},
          issuer: 'did:trackback:issuer/1234',
        })
      ).to.be.equal(true);
    });
  });

  describe('VC Tests for validate ', () => {
    it('validate credential @context', () => {
      expect(() => new VC().validate({})).to.throw(
        Error,
        'Credentials must have a "@context" property'
      );
    });

    it('Credentials first item is a URI: https://www.w3.org/2018/credentials/v1', () => {
      expect(() =>
        new VC().validate({
          '@context': [''],
        })
      ).to.throw(
        Error,
        'Credentials first item is a URI with the value https://www.w3.org/2018/credentials/v1'
      );
    });

    it('Credentials should have a type attribute', () => {
      expect(() =>
        new VC().validate({
          '@context': ['https://www.w3.org/2018/credentials/v1'],
        })
      ).to.throw(Error, 'Credentials must have "type"');
    });

    it('Credentials should have a type (array) attribute ', () => {
      expect(() =>
        new VC().validate({
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: '',
        })
      ).to.throw(Error, 'Credentials must have "type"');
    });

    it('Credentials should have a type VerifiableCredential ', () => {
      expect(() =>
        new VC().validate({
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['TestCredential'],
        })
      ).to.throw(Error, '"type" must have VerifiableCredential');
    });

    it('Credentials should have a type credentialSubject ', () => {
      expect(() =>
        new VC().validate({
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential'],
        })
      ).to.throw(Error, 'Credentials must have "credentialSubject"');
    });

    it('Credentials should have a type issuer ', () => {
      expect(() =>
        new VC().validate({
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential'],
          credentialSubject: {},
        })
      ).to.throw(Error, 'Credentials must have "issuer"');
    });

    it('Credentials should be valid ', () => {
      expect(
        new VC().validate({
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential'],
          credentialSubject: {},
          issuer: 'did:trackback:issuer/1234',
        })
      ).to.be.equal(true);
    });
  });

  describe('VC Tests for issueJWT ', () => {
    it('Credentials should be valid ', async () => {
      const vc = new VC();
      const keyPair = await JsonWebKey2020.generate();

      const credential = {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential'],
        issuanceDate: '2010-01-01T19:23:24Z',
        credentialSubject: {},
        issuer: 'did:trackback:issuer/1234',
      };
      const jwt = await vc.issue({ keyPair, credential });

      const [encodedHeader, encodedPayload] = jwt.split('.');

      const header = JSON.parse(
        Buffer.from(encodedHeader, 'base64').toString()
      );
      const payload = JSON.parse(
        Buffer.from(encodedPayload, 'base64').toString()
      );

      expect(typeof jwt).to.be.equal('string');
      expect(jwt.split('.').length).to.be.equal(3);
      expect(header.alg).to.be.equal(keyPair.getPublicKey().alg);
      expect(payload.vc).to.be.an('object');
      expect(JSON.stringify(payload.vc)).to.be.equal(
        JSON.stringify(credential)
      );
    });
  });

  describe('VC Tests for veifyJWT ', () => {
    it.skip('Credentials should be valid ', async () => {
      const vc = new VC();
      const key = {
        id: 'did:trackback:key:SBQyXxAUa41yrBP9YJ-mPsCtESFjmzbOIUrzGI3-oWs#SBQyXxAUa41yrBP9YJ-mPsCtESFjmzbOIUrzGI3-oWs',
        type: 'JsonWebKey2020',
        controller:
          'did:trackback:key:SBQyXxAUa41yrBP9YJ-mPsCtESFjmzbOIUrzGI3-oWs',
        publicKeyJwk: {
          crv: 'Ed25519',
          x: 'VBB9DDDSl3IMPNGlx5f4h-NY2AVKpOMauKqVSm3LYcU',
          kty: 'OKP',
          alg: 'EdDSA',
        },
        privateKeyJwk: {
          crv: 'Ed25519',
          d: 'nVlVbr0cfTf0KxIfha2LsOt3x4G7rJ2mRc_TbYXsscY',
          x: 'VBB9DDDSl3IMPNGlx5f4h-NY2AVKpOMauKqVSm3LYcU',
          kty: 'OKP',
          alg: 'EdDSA',
        },
      };
      const keyPair = JsonWebKey2020.import(key);

      const JWT = `eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDp0cmFja2JhY2s6a2V5OlNCUXlYeEFVYTQxeXJCUDlZSi1tUHNDdEVTRmptemJPSVVyekdJMy1vV3MjU0JReVh4QVVhNDF5ckJQOVlKLW1Qc0N0RVNGam16Yk9JVXJ6R0kzLW9XcyJ9.eyJpc3MiOiJkaWQ6dHJhY2tiYWNrOmlzc3Vlci8xMjM0IiwibmJmIjoxMjYyMzczODA0LCJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIl0sImlzc3VhbmNlRGF0ZSI6IjIwMTAtMDEtMDFUMTk6MjM6MjRaIiwiY3JlZGVudGlhbFN1YmplY3QiOnt9LCJpc3N1ZXIiOiJkaWQ6dHJhY2tiYWNrOmlzc3Vlci8xMjM0In19.Lnaizuud1y7q6ZV7gprkGUJkQwPFEYjIXskG25EsF5QrLXZHefkVbulXmIiAvUT634LthaTc92oKpA_jzvQIBQ`;

      const credential = {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential'],
        issuanceDate: '2010-01-01T19:23:24Z',
        credentialSubject: {},
        issuer: 'did:trackback:issuer/1234',
      };

      const result = await vc.verify(JWT, { keyPair, credential });

      expect(result).to.be.equal(true);
    });
  });
});
