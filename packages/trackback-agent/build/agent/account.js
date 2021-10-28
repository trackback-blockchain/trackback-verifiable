"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccount = exports.generateMnemonic = void 0;
const keyring_1 = __importDefault(require("@polkadot/keyring"));
const util_crypto_1 = require("@polkadot/util-crypto");
function generateMnemonic(numWords, onlyJs) {
    return (0, util_crypto_1.mnemonicGenerate)(numWords, onlyJs);
}
exports.generateMnemonic = generateMnemonic;
function createAccount(metadata) {
    const keyring = new keyring_1.default({ type: "sr25519", ss58Format: 42 });
    const MNEMONIC = (0, util_crypto_1.mnemonicGenerate)();
    const keyPair = keyring.addFromUri(MNEMONIC, metadata);
    return {
        keyPair,
        mnemonic: MNEMONIC,
    };
}
exports.createAccount = createAccount;
//# sourceMappingURL=account.js.map