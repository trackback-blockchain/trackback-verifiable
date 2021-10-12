import DIDResolver from '../src/resolver';
import { expect } from 'chai';
import { DIDResolutionResult } from '../src/types';

describe('DID Utility Tests', function () {
  describe('Tests for parseDID()', () => {
    it('parseDID should return trackback', () => {
      const did = new DIDResolver();
      const result = did.parseDID('did:trackback:1324');

      expect(result).to.be.an('object').to.have.property('prefix');

      expect(result.prefix).to.equal('trackback');
    });

    it('parseDID should return TypeError: Not a valid did format', () => {
      const did = new DIDResolver();

      expect(() => did.parseDID('did:test')).to.throw('Not a valid did format');
    });
  });

  describe('Tests for resolve()', () => {
    const emptyResult: DIDResolutionResult = {
      didResolutionMetadata: {},
      didDocument: null,
      didDocumentMetadata: {},
    };
    const mockOptions = (method: string) => ({
      method,
      resolver: {
        resolve: async (did: string): Promise<DIDResolutionResult> => ({
          didResolutionMetadata: {},
          didDocument: {
            '@context': 'https://w3id.org/did/v1',
            id: did,
          },
          didDocumentMetadata: {},
        }),
      },
    });

    it('should not resolve for unknown method', async () => {
      const { method, resolver } = mockOptions('trackback');

      const didUtil = new DIDResolver(method, resolver);
      const result: DIDResolutionResult = await didUtil.resolve(
        'did:web:test1234'
      );

      expect(result).to.be.an('object');
      expect(result).to.eql(emptyResult);
    });

    it('should not resolve for bad did', async () => {
      const { method, resolver } = mockOptions('trackback');

      const didUtil = new DIDResolver(method, resolver);
      const result: DIDResolutionResult = await didUtil.resolve('did:34');

      expect(result).to.be.an('object');
      expect(result).to.eql(emptyResult);
    });

    it('should resolve for known method', async () => {
      const { method, resolver } = mockOptions('trackback');

      const did = 'did:trackback:test1234';

      const expected = await resolver.resolve(did);

      const didUtil = new DIDResolver(method, resolver);
      const result: DIDResolutionResult = await didUtil.resolve(did);

      expect(result).to.be.an('object');
      expect(result).to.eql(expected);
    });
  });
});
