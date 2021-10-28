"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialIssuer = void 0;
const key_1 = require("@trackback/key");
const vc_1 = require("@trackback/vc");
const uuid_1 = require("uuid");
/**
 * Trackback implementation for issuing credentials and presentations
 */
class CredentialIssuer {
    constructor(options) {
        this.id = options === null || options === void 0 ? void 0 : options.id;
        this.keypair = options === null || options === void 0 ? void 0 : options.keypair;
        this.credentialBuilder = new vc_1.CredentialBuilder();
    }
    static build(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = (options === null || options === void 0 ? void 0 : options.id) || `did:trackback:${(0, uuid_1.v4)()}`;
            const keypair = yield key_1.JsonWebKey2020.generate();
            return new CredentialIssuer(Object.assign(Object.assign({}, options), { id, keypair }));
        });
    }
    getIssuer() {
        return this.id;
    }
    /**
     * Save Issuer did document
     * @param context - ITrackBackContext
     * @returns json didDocument
     */
    save(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const didDocument = this.toDidDocument();
            if (context && context.agent) {
                yield context.agent.procedure.constructDIDDocument(context.account.keyPair, didDocument, {}, {}, didDocument.id, [""]);
            }
            return didDocument;
        });
    }
    /**
     * create did document for this issuer
     * @returns json didDocument
     */
    toDidDocument() {
        const didDocument = {
            "@context": [
                "https://www.w3.org/ns/did/v1"
            ],
            id: this.id,
        };
        const { id, type, controller, publicKeyJwk } = this.keypair;
        didDocument['verificationMethod'] = [{
                id,
                controller,
                type,
                publicKeyJwk
            }];
        return didDocument;
    }
    /**
     * Create Verifiable Credentials as JWT
     *
     * @remarks Please see {@link https://www.w3.org/TR/vc-data-model/#json-web-token | 6.3.1 JSON Web Token}
     * @param cred - The credential
     * @param keyPair - optional key pair
     * @returns jwt
     */
    createVerifiableCredentials(cred, keyPair) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!cred)
                throw new Error("Credentials required");
            if (!keyPair && !this.keypair)
                throw new Error("keyPair required");
            const vc = new vc_1.VC();
            return vc.issue({ keyPair: (keyPair || this.keypair), credential: cred });
        });
    }
    /**
     * Create JWT payload of a JWT based verifiable presentation
     * @remarks Please see {@link https://www.w3.org/TR/vc-data-model/#example-31-jwt-payload-of-a-jwt-based-verifiable-presentation-non-normative | JWT payload of a JWT based verifiable presentation (non-normative)}
     * @param vcs - array of JWT
     * @param keyPair - JWT key pair
     * @returns jwt
     */
    createVerifiablePresentation(vcs, keyPair) {
        if (!vcs || vcs.length === 0)
            throw new Error("One or more VerifiableCredentials required");
        if (!keyPair)
            throw new Error("keyPair required");
        const presentation = {
            '@context': ['https://www.w3.org/2018/credentials/v1'],
            type: ['VerifiablePresentation'],
            verifiableCredential: [
                ...vcs
            ],
        };
        const vp = new vc_1.VP();
        return vp.issue({ keyPair, presentation });
    }
    /**
     * Generate IKeyPair
     * @param controller - did uri of the controller
     * @param alg - algorithm key
     * @param options -
     * @returns
     */
    generateKeyPair(controller, alg, options) {
        return key_1.JsonWebKey2020.generate(controller, alg, options);
    }
    /**
     * import IKeyPair from object
     * @param keyPair - json IKeyPair type
     * @returns IKeyPair
     */
    import(keyPair) {
        return key_1.JsonWebKey2020.import(keyPair);
    }
}
exports.CredentialIssuer = CredentialIssuer;
//# sourceMappingURL=CredentialIssuer.js.map