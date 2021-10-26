"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackBackAgent = void 0;
const procedure_1 = require("./procedure");
const account_1 = require("./account");
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