import { ITrackbackAccount } from './../../src/types/ITrackbackAccount';
import { ITrackBackContext } from './../../src/types/ITrackBackContext';
import { CredentialVerifier } from '../../src/verifier/CredentialVerifier'
import { CredentialIssuer } from '../../src/issuer/CredentialIssuer'
import { createAccount } from '../../src/agent/account'

import { expect } from 'chai';


const expectThrowsAsync = async (method: any, errorMessage: string) => {
    let error: any = null
    try {
        await method()
    }
    catch (err) {
        error = err
    }

    expect(error).to.be.an('Error')
    if (errorMessage) {
        expect(error.message).to.equal(errorMessage)
    }
}

describe('CredentialVerifier', () => {

    let trackbackAcc: ITrackbackAccount;
    let context: ITrackBackContext;

    beforeEach(() => {
        trackbackAcc = createAccount({})
        context = {
            agent: {
                procedure: {
                    resolve: (any) => Promise.resolve(null),
                    constructDIDDocument: (any) => Promise.resolve(null),
                    updateDIDDocument: (any) => Promise.resolve(null),
                    dispatch: (any) => Promise.resolve(null),
                    saveToDistributedStorage: (data: any, headers: any) => Promise.resolve(null),
                    revoke:(account: any, didURI: string) => Promise.resolve(null),
                }

            },
            account: trackbackAcc
        }
    })


    describe('credential tests', () => {
        it('should fail for object', async () => {
            const verifier = new CredentialVerifier();

            await expectThrowsAsync(() => verifier.verifyCredentials({}, context), "only jwt verification is supported")

        });

        it('should fail for empty credentials', async () => {
            const verifier = new CredentialVerifier();
            await expectThrowsAsync(() => verifier.verifyCredentials("", context), "Unexpected end of JSON input")
        });


        it('should fail for non resolvable issuer', async () => {
            const issuer = await CredentialIssuer.build();
            const verifier = new CredentialVerifier();

            const credential = {
                '@context': ['https://www.w3.org/2018/credentials/v1'],
                type: ['VerifiableCredential'],
                issuanceDate: '2010-01-01T19:23:24Z',
                credentialSubject: {},
                issuer: issuer.id,
            };

            const jwt = await issuer.createVerifiableCredentials(credential)

            await expectThrowsAsync(() => verifier.verifyCredentials(jwt, context), 'issuer not resolvable')
        });

        it('should be valid jwt', async () => {

            const issuer = await CredentialIssuer.build();
            const verifier = new CredentialVerifier();

            const mockprocedure = {
                resolve: (any: any) => Promise.resolve({
                    did_resolution_metadata: {},
                    did_document: issuer.toDidDocument(),
                    did_document_metadata: {}
                }),
                constructDIDDocument: (any: any) => Promise.resolve(null),
                updateDIDDocument: (any: any) => Promise.resolve(null),
                dispatch: (any: any) => Promise.resolve(null),
                saveToDistributedStorage: (data: any, headers: any) => Promise.resolve(null),
                revoke:(account: any, didURI: string) => Promise.resolve(null),
            }

            context.agent.procedure = mockprocedure


            const credential = {
                '@context': ['https://www.w3.org/2018/credentials/v1'],
                type: ['VerifiableCredential'],
                issuanceDate: '2010-01-01T19:23:24Z',
                credentialSubject: {},
                issuer: issuer.id,
            };

            const jwt = await issuer.createVerifiableCredentials(credential)
            const r = await verifier.verifyCredentials(jwt, context);


            expect(r).to.be.equal(true)

        });

    });

    describe('presentation tests', () => {
        it('should fail for object', async () => {
            const verifier = new CredentialVerifier();

            await expectThrowsAsync(() => verifier.verifyPresentation({}, context), "only jwt verification is supported")

        });

        it('should fail for empty credentials', async () => {
            const verifier = new CredentialVerifier();
            await expectThrowsAsync(() => verifier.verifyPresentation("", context), "Unexpected end of JSON input")
        });


        it('should fail for non resolvable issuer', async () => {
            const issuer = await CredentialIssuer.build();
            const verifier = new CredentialVerifier();

            const credential = {
                '@context': ['https://www.w3.org/2018/credentials/v1'],
                type: ['VerifiableCredential'],
                issuanceDate: '2010-01-01T19:23:24Z',
                credentialSubject: {},
                issuer: issuer.id,
            };

            const jwt = await issuer.createVerifiableCredentials(credential);

            const jwtPresentation = await issuer.createVerifiablePresentation([jwt], issuer.keypair);

            await expectThrowsAsync(() => verifier.verifyPresentation(jwtPresentation, context), "could not resolve verificationMethod.")

        });


        it('should fail for non resolvable issuer', async () => {
            const issuer = await CredentialIssuer.build();
            const verifier = new CredentialVerifier();

            const credential = {
                '@context': ['https://www.w3.org/2018/credentials/v1'],
                type: ['VerifiableCredential'],
                issuanceDate: '2010-01-01T19:23:24Z',
                credentialSubject: {},
                issuer: issuer.id,
            };

            const mockprocedure = {
                resolve: (any: any) => Promise.resolve({
                    did_resolution_metadata: {},
                    did_document: issuer.toDidDocument(),
                    did_document_metadata: {}
                }),
                constructDIDDocument: (any: any) => Promise.resolve(null),
                updateDIDDocument: (any: any) => Promise.resolve(null),
                dispatch: (any: any) => Promise.resolve(null),
                saveToDistributedStorage: (data: any, headers: any) => Promise.resolve(null),
                revoke:(account: any, didURI: string) => Promise.resolve(null),
            }

            context.agent.procedure = mockprocedure

            const jwt = await issuer.createVerifiableCredentials(credential);

            const jwtPresentation = await issuer.createVerifiablePresentation([jwt], issuer.keypair);

            const r = await verifier.verifyPresentation(jwtPresentation, context, issuer.keypair)

            expect(r).to.be.equal(true)
        });

    });

});
