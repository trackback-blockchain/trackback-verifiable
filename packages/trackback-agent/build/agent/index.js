"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackBackAgent = void 0;
const procedure_1 = require("./procedure");
const account_1 = require("./account");
__exportStar(require("./connection"), exports);
__exportStar(require("./account"), exports);
__exportStar(require("./enums"), exports);
__exportStar(require("./utils"), exports);
class TrackBackAgent {
    constructor(connection) {
        this.procedure = new procedure_1.Procedure(connection);
    }
    createAccount(metadata) {
        return (0, account_1.createAccount)(metadata);
    }
}
exports.TrackBackAgent = TrackBackAgent;
//# sourceMappingURL=index.js.map