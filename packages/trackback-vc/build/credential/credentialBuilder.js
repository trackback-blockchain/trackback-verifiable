"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialBuilder = void 0;
const moment_1 = __importDefault(require("moment"));
const constants_1 = require("../constants");
const check_1 = require("./check");
class CredentialBuilder {
    constructor() {
        this._context = [constants_1.CREDIENTIAL_CONTEXT];
        this._type = new Set();
    }
    setContext(context) {
        this._context = [...this._context, ...context];
        return this;
    }
    setId(id) {
        this._id = id;
    }
    setType(types) {
        types.forEach((type) => {
            this._type.add(type);
        });
        return this;
    }
    setCredentialSubject(subject) {
        this._credentialSubject = subject;
        return this;
    }
    setIssuer(issuer) {
        this._issuer = issuer;
        return this;
    }
    setCredentialStatus(status) {
        this._status = status;
        return this;
    }
    /**
     * RFC_3339
     * @param {string} date RFC_3339 format
     * @returns
     */
    setIssuanceDate(date) {
        const _date = typeof date !== 'string' ? (0, moment_1.default)(date).toISOString() : date;
        this._issuanceDate = _date;
        return this;
    }
    setExpirationDate(date) {
        const _date = typeof date !== 'string' ? (0, moment_1.default)(date).toISOString() : date;
        this._expirationDate = _date;
        return this;
    }
    build() {
        const type = Array.from(this._type);
        if (!type.includes(constants_1.VERIFIABLE_CREDENTIALS)) {
            type.push(constants_1.VERIFIABLE_CREDENTIALS);
        }
        const cred = {
            '@context': [...this._context],
            id: this._id,
            type: type,
            credentialSubject: this._credentialSubject,
            issuer: this._issuer,
            issuanceDate: this._issuanceDate,
            expirationDate: this._expirationDate,
            credentialStatus: this._status,
        };
        // remove null values
        const cleanedCredentials = Object.fromEntries(Object.entries(cred).filter(([_, v]) => v != null));
        console.log(cleanedCredentials);
        (0, check_1.check)(cleanedCredentials);
        return cleanedCredentials;
    }
}
exports.CredentialBuilder = CredentialBuilder;
//# sourceMappingURL=credentialBuilder.js.map