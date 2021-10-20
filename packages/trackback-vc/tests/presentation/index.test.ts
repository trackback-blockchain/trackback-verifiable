import { expect } from 'chai';
import { VP } from './../../src/';
import { JsonWebKey2020 } from '@trackback/key';

describe('Presentation Tests', () => {
  describe('Check presentation Tests', () => {
    it('validate @context', () => {
      const vp = new VP();
      expect(() => vp.validate({})).to.throw(Error, '@context required.');
    });

    it('Credentials should have a type attribute', () => {
      const vp = new VP();
      expect(() =>
        vp.validate({
          '@context': ['https://www.w3.org/2018/credentials/v1'],
        })
      ).to.throw(Error, 'Credentials must have "type"');
    });

    describe('Presentation must validate credentials', () => {
      it('validate credential @context', () => {
        const vp = new VP();

        const presentation = {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiablePresentation'],
          verifiableCredential: {},
        };

        expect(() => vp.validate(presentation)).to.throw(
          Error,
          'Credentials must have a "@context" property'
        );
      });

      it('Credentials first item is a URI: https://www.w3.org/2018/credentials/v1', () => {
        const vp = new VP();
        const presentation = {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiablePresentation'],
          verifiableCredential: { '@context': [''] },
        };

        expect(() => vp.validate(presentation)).to.throw(
          Error,
          'Credentials first item is a URI with the value https://www.w3.org/2018/credentials/v1'
        );
      });

      it('Credentials should have a type attribute', () => {
        const vp = new VP();

        const presentation = {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiablePresentation'],
          verifiableCredential: {
            '@context': ['https://www.w3.org/2018/credentials/v1'],
          },
        };

        expect(() => vp.validate(presentation)).to.throw(
          Error,
          'Credentials must have "type"'
        );
      });

      it('Credentials should have a type (array) attribute ', () => {
        const vp = new VP();

        const presentation = {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiablePresentation'],
          verifiableCredential: {
            '@context': ['https://www.w3.org/2018/credentials/v1'],
            type: '',
          },
        };
        expect(() => vp.validate(presentation)).to.throw(
          Error,
          'Credentials must have "type"'
        );
      });

      it('Credentials should have a type VerifiableCredential ', () => {
        const vp = new VP();
        const presentation = {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiablePresentation'],
          verifiableCredential: {
            '@context': ['https://www.w3.org/2018/credentials/v1'],
            type: ['TestCredential'],
          },
        };

        expect(() => vp.validate(presentation)).to.throw(
          Error,
          '"type" must have VerifiableCredential'
        );
      });

      it('Credentials should have a type credentialSubject ', () => {
        const vp = new VP();
        const presentation = {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiablePresentation'],
          verifiableCredential: {
            '@context': ['https://www.w3.org/2018/credentials/v1'],
            type: ['VerifiableCredential'],
          },
        };

        expect(() => vp.validate(presentation)).to.throw(
          Error,
          'Credentials must have "credentialSubject"'
        );
      });

      it('Credentials should have a type issuer ', () => {
        const vp = new VP();

        const presentation = {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiablePresentation'],
          verifiableCredential: [
            {
              '@context': ['https://www.w3.org/2018/credentials/v1'],
              type: ['VerifiableCredential'],
              credentialSubject: {},
            },
          ],
        };

        expect(() => vp.validate(presentation)).to.throw(
          Error,
          'Credentials must have "issuer"'
        );
      });

      it('Credentials should be valid ', () => {
        const vp = new VP();

        const presentation = {
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiablePresentation'],
          verifiableCredential: [
            {
              '@context': ['https://www.w3.org/2018/credentials/v1'],
              type: ['VerifiableCredential'],
              credentialSubject: {},
              issuer: 'did:trackback:issuer/1234',
            },
          ],
        };

        expect(vp.validate(presentation)).to.be.equal(undefined);
      });
    });
  });

  describe('VP Tests for issue and verify JWT', () => {
    it('should create a valid jwt ', async () => {
      const vp = new VP();

      const keyPair = await JsonWebKey2020.generate();

      const presentation = {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiablePresentation'],
        verifiableCredential: [
          {
            '@context': ['https://www.w3.org/2018/credentials/v1'],
            type: ['VerifiableCredential'],
            credentialSubject: {},
            issuer: 'did:trackback:issuer/1234',
          },
        ],
      };

      const jwt = await vp.issueJWT({ keyPair, presentation });

      const [encodedHeader, encodedPayload] = jwt.split('.');

      const header = JSON.parse(
        Buffer.from(encodedHeader, 'base64').toString()
      );
      const payload = JSON.parse(
        Buffer.from(encodedPayload, 'base64').toString()
      );

      expect(typeof jwt).to.be.equal('string');
      expect(jwt.split('.').length).to.be.equal(3);
      expect(header.alg).to.be.equal(keyPair.getPublicKeyJwk().alg);
      expect(payload.vp).to.be.an('object');
      expect(JSON.stringify(payload.vp)).to.be.equal(
        JSON.stringify(presentation)
      );
    });

    it('Credentials should be valid ', async () => {
      const vp = new VP();
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
      const keyPair = JsonWebKey2020.from(key);

      const JWT = `eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDp0cmFja2JhY2s6a2V5OlNCUXlYeEFVYTQxeXJCUDlZSi1tUHNDdEVTRmptemJPSVVyekdJMy1vV3MjU0JReVh4QVVhNDF5ckJQOVlKLW1Qc0N0RVNGam16Yk9JVXJ6R0kzLW9XcyJ9.eyJuYmYiOjE2MzQ2ODA2MDksInZwIjp7IkBjb250ZXh0IjpbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIl0sInR5cGUiOlsiVmVyaWZpYWJsZVByZXNlbnRhdGlvbiJdLCJ2ZXJpZmlhYmxlQ3JlZGVudGlhbCI6W3siQGNvbnRleHQiOlsiaHR0cHM6Ly93d3cudzMub3JnLzIwMTgvY3JlZGVudGlhbHMvdjEiXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCJdLCJjcmVkZW50aWFsU3ViamVjdCI6e30sImlzc3VlciI6ImRpZDp0cmFja2JhY2s6aXNzdWVyLzEyMzQifV19fQ.mZLZIH-BOd3r72ryGEkfs7UBfIQ5_fSRchUo9h7DgIwd9L2BE3fhIviJW2X9YMIyEVeAi8C2Yz1m8ETT9pmHBw`;

      const presentation = {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiablePresentation'],
        verifiableCredential: [
          {
            '@context': ['https://www.w3.org/2018/credentials/v1'],
            type: ['VerifiableCredential'],
            credentialSubject: {},
            issuer: 'did:trackback:issuer/1234',
          },
        ],
      };

      const result = await vp.verifyJWT(JWT, { keyPair, presentation });

      expect(result).to.be.equal(true);
    });
  });
});
