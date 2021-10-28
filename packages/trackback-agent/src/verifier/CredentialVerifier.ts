import { JsonWebKey2020 } from '@trackback/key';
import { VP, VC } from '@trackback/vc';
import { IKeyPair, ITrackBackContext } from './../types';



function decodeJWT(jwt: string) {
    const [encodedHeader, encodedPayload, signature] = jwt.split('.');

    const header = JSON.parse(Buffer.from(encodedHeader, 'base64').toString());
    const payload = JSON.parse(
        Buffer.from(encodedPayload, 'base64').toString()
    );

    return {
        header,
        payload,
        signature
    }
}


async function resolveKeyPair(issuer: string, context: ITrackBackContext): Promise<IKeyPair> {
    const result = await context?.agent?.procedure.resolve(issuer);

    if (!result || !result.didDocument) {
        throw new Error('issuer not resolvable');
    }

    const verificationMethod = result.didDocument.verificationMethod;

    const supportedKey = (verificationMethod || []).find(v => v.type === 'JsonWebKey2020')

    return JsonWebKey2020.import(supportedKey);
}


export class CredentialVerifier {


    /**
     *  Verify w3 credentials as jwt
     * @param credentials - credentials as jwt
     * @param context - trackback context
     * @returns promise true/false
     */

    async verifyCredentials(credentials: any, context: ITrackBackContext): Promise<boolean> {
        const vc = new VC();

        if (typeof credentials === 'string') {
            const { header, payload } = decodeJWT(credentials);

            if (!header.alg) {
                throw new Error('alg is required in JWT header');
            }
            if (!payload.vc) {
                throw new Error('vp property is required in JWT');
            }

            const issuer = payload.iss;

            if (!issuer) {
                throw new Error('issuer is required to verify signature');
            }
            let keyPair;
            if (issuer) {
                keyPair = await resolveKeyPair(issuer, context)
            }
            if (!keyPair) {
                throw new Error('keyPair not resolvable');
            }

            return vc.verify(credentials, {
                keyPair,
                credential: payload
            });

        }

        throw new Error('only jwt verification is supported');
    }


    /**
     * Verify presentation for jwt
     * @param presentation - presentation jwt format
     * @param context - trackback context
     * @param keypair - key pair to verify presentation
     * @returns promise true/false
     */
    async verifyPresentation(presentation: any, context: ITrackBackContext, keypair?: IKeyPair): Promise<boolean> {

        if (typeof presentation === 'string') {
            const { header, payload } = decodeJWT(presentation);

            if (!header.alg) {
                throw new Error('alg is required in JWT header');
            }
            if (!payload.vp) {
                throw new Error('vp property is required in JWT');
            }

            const issuer = payload.iss;

            if (issuer && context && !keypair) {
                keypair = await resolveKeyPair(issuer, context)
            }

            if (!keypair) {
                throw new Error('could not resolve verificationMethod.');
            }

            const vp = new VP();

            vp.validate(payload.vp)

            const r = await vp.verify(presentation, {
                keyPair: keypair,
                presentation: payload.vp
            });

            if (!r) {
                return false;
            }

            const credentials = payload.vp.verifiableCredential;

            const credentialsPromises: Promise<boolean>[] = credentials.map((c: any) => this.verifyCredentials(c, context));

            const status = await Promise.all(credentialsPromises)

            return status.reduce((a, b) => a && b, true);

        }

        throw new Error('only jwt verification is supported')

    }


    static decodeJWT(jwt: string): { header: any, payload: any, signature: string} {
        return decodeJWT(jwt);
    }
}