import { expect } from 'chai';

import { CredentialIssuer } from '../../src/issuer/CredentialIssuer'

describe('Creadential issuer', () => {

    it('should generate valid keyPair', async () => {
        const issuer = new CredentialIssuer();

        const key = await issuer.generateKeyPair()

        expect((key.getPublicKey() as any).kty).to.equal('OKP');
        expect((key.getPublicKey() as any).crv).to.equal('Ed25519');
    });


    it('should create jwt for credential ', async () => {
        const issuer = new CredentialIssuer();
        const keyPair = await issuer.generateKeyPair()

        const credential = {
            '@context': ['https://www.w3.org/2018/credentials/v1'],
            type: ['VerifiableCredential'],
            issuanceDate: '2010-01-01T19:23:24Z',
            credentialSubject: {},
            issuer: 'did:trackback:issuer/1234',
        };
        const jwt = await issuer.createVerifiableCredentials(credential, keyPair);

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


    it('should create jwt for presenation ', async () => {

        const issuer = new CredentialIssuer();
        const keyPair = await issuer.generateKeyPair()

        const credential = {
            '@context': ['https://www.w3.org/2018/credentials/v1'],
            type: ['VerifiableCredential'],
            issuanceDate: '2010-01-01T19:23:24Z',
            credentialSubject: {},
            issuer: 'did:trackback:issuer/1234',
        };
        const jwt = await issuer.createVerifiableCredentials(credential, keyPair);


        const presentation = await issuer.createVerifiablePresentation([jwt], keyPair)
        
        expect(typeof presentation).to.be.equal('string');
        expect(presentation.split('.').length).to.be.equal(3);
    });


})