"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNonEmptyArray = exports.toISODateTime = exports.checkDate = exports.bufferToUint8Array = void 0;
const moment_1 = __importDefault(require("moment"));
function bufferToUint8Array(buffer) {
    const u8a = new Uint8Array(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
        u8a[i] = buffer[i];
    }
    return u8a;
}
exports.bufferToUint8Array = bufferToUint8Array;
function checkDate(date) {
    throw new Error('not yet implemented');
}
exports.checkDate = checkDate;
function toISODateTime(datetime, format) {
    return (0, moment_1.default)(datetime).toISOString();
}
exports.toISODateTime = toISODateTime;
function isNonEmptyArray(item) {
    return Array.isArray(item) && item.length > 0;
}
exports.isNonEmptyArray = isNonEmptyArray;
//# sourceMappingURL=index.js.map