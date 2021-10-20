import { expect } from 'chai';
import { Builder } from './../src/builder';

describe('DID Builder Tests', function () {
  it('build a did', () => {
    const did = new Builder();
    did.setId('did:test:1234');

    expect(did.build()).to.be.an('object').to.have.property('id');
  });

  it('should throw error', () => {
    const did = new Builder();

    expect(() => did.build()).to.throw(Error, 'id required');
  });

  it('should throw error on prefix', () => {
    const did = new Builder();
    did.setId('some-prefix');
    expect(() => did.build()).to.throw(Error, 'did: prefix required');
  });
});
