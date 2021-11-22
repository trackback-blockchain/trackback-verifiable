import { expect } from 'chai';

import { CredentialIssuer } from '../../src/issuer/CredentialIssuer'

describe('Creadential issuer', () => {

    it('should generate valid keyPair', async () => {
        const issuer = new CredentialIssuer();

        const key = await issuer.generateKeyPair()

        expect((key.getPublicKey() as any).kty).to.equal('OKP');
        expect((key.getPublicKey() as any).crv).to.equal('Ed25519');
    });


    it('should save addtional parameters', async () => {
        const issuer = await CredentialIssuer.build();

        issuer.setAlsoKnownAs(["https://test.example/"]);

        issuer.setAssertionMethod([{
            "id": "did:example:123456789abcdefghi#keys-2",
            "type": "Ed25519VerificationKey2020",
            "controller": "did:example:123456789abcdefghi",
            "publicKeyMultibase": "zH3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"
        }])

        issuer.setCapabilityDelegation([{
            "id": "did:example:123456789abcdefghi#keys-2",
            "type": "Ed25519VerificationKey2020",
            "controller": "did:example:123456789abcdefghi",
            "publicKeyMultibase": "zH3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"
        }])

        issuer.setCapabilityInvocation([{
            "id": "did:example:123456789abcdefghi#keys-2",
            "type": "Ed25519VerificationKey2020",
            "controller": "did:example:123456789abcdefghi",
            "publicKeyMultibase": "zH3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"
        }])

        issuer.setKeyAgreement([{
            "id": "did:example:123456789abcdefghi#keys-2",
            "type": "Ed25519VerificationKey2020",
            "controller": "did:example:123456789abcdefghi",
            "publicKeyMultibase": "zH3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"
        }])

        issuer.setController("did:example:bcehfew7h32f32h7af3");

        issuer.setService([{
            "id": "did:example:123#linked-domain",
            "type": "LinkedDomains",
            "serviceEndpoint": "https://bar.example.com"
        }]);

        const didDocument = issuer.toDidDocument();

        expect(didDocument).to.be.an('object');

        expect(didDocument.controller).to.be.equal("did:example:bcehfew7h32f32h7af3");

        const test = [{
            "id": "did:example:123456789abcdefghi#keys-2",
            "type": "Ed25519VerificationKey2020",
            "controller": "did:example:123456789abcdefghi",
            "publicKeyMultibase": "zH3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"
        }]

        expect(didDocument.keyAgreement).to.deep.equal(test);
        expect(didDocument.capabilityDelegation).to.deep.equal(test);
        expect(didDocument.capabilityInvocation).to.deep.equal(test);
        expect(didDocument.assertionMethod).to.deep.equal(test);
        expect(didDocument.alsoKnownAs).to.deep.equal(["https://test.example/"]);

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