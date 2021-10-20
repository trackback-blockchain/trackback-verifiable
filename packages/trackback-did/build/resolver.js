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
const helpers_1 = require("./helpers");
const emptyResult = {
    didResolutionMetadata: {},
    didDocument: null,
    didDocumentMetadata: {},
};
class DIDResolver {
    constructor(method, resolver) {
        this._resolverMap = {};
        if (method && resolver) {
            this.add(method, resolver);
        }
    }
    add(method, resolver) {
        const map = {
            [method]: resolver,
        };
        Object.assign(this._resolverMap, map);
    }
    resolve(did, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parse = this.parseDID(did);
                const resolver = this._resolverMap[parse.prefix];
                const didDocumentResult = yield resolver.resolve(did, options);
                return {
                    didResolutionMetadata: didDocumentResult.didResolutionMetadata,
                    didDocument: didDocumentResult.didDocument,
                    didDocumentMetadata: didDocumentResult.didDocumentMetadata,
                };
            }
            catch (error) {
                return Object.assign({}, emptyResult);
            }
        });
    }
    /**
     * find did method from did uri
     * @param {string} did  DID uri.
     *
     * @returns {{prefix: string}} Returns the did method
     */
    parseDID(did) {
        if (!did) {
            throw new TypeError('DID cannot be empty.');
        }
        if (!helpers_1.DID_FORMAT.test(did)) {
            throw new TypeError('Not a valid did format');
        }
        const prefix = did.split(':').slice(1, 2).join(':');
        return { prefix };
    }
}
exports.default = DIDResolver;
//# sourceMappingURL=resolver.js.map