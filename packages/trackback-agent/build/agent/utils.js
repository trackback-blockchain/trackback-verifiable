"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexToUtf8 = exports.convert = exports.uriToHex = exports.tohex = exports.toUint8Array = exports.transformParams = exports.isNumType = exports.Utils = exports.DefaultOptions = exports.DistributedStorageOptions = void 0;
exports.DistributedStorageOptions = {
    url: "https://ipfs-connector.trackback.dev",
    api: "/api/0.1/",
    decentralisedStoreURL: "https://ipfs.trackback.dev:8080/ipfs/"
};
exports.DefaultOptions = {
    url: "ws://127.0.0.1:9944",
    options: {
        types: {
            VerifiableCredential: {
                account_id: "AccountId",
                public_key: "Vec<u8>",
                block_time_stamp: "u64",
                active: "bool",
            },
            DID: {
                did_resolution_metadata: "Option<Vec<u8>>",
                did_document_metadata: "Option<Vec<u8>>",
                block_number: "BlockNumber",
                block_time_stamp: "u64",
                updated_timestamp: "u64",
                did_ref: "Option<Vec<u8>>",
                sender_account_id: "Vec<u8>",
                public_keys: "Option<Vec<Vec<u8>>>",
            },
        },
        rpc: {
            didModule: {
                dIDDocument: {
                    description: "Get DID Documnet",
                    params: [
                        {
                            name: "didDocumentHash",
                            type: "Vec<u8>",
                        },
                    ],
                    type: "DID",
                },
            },
        },
    },
};
exports.Utils = {
    paramConversion: {
        num: [
            "Compact<Balance>",
            "BalanceOf",
            "u8",
            "u16",
            "u32",
            "u64",
            "u128",
            "i8",
            "i16",
            "i32",
            "i64",
            "i128",
        ],
    },
};
const isNumType = (type) => exports.Utils.paramConversion.num.some((el) => type.indexOf(el) >= 0);
exports.isNumType = isNumType;
function transformParams(paramFields, inputParams, opts = { emptyAsNull: true }) {
    const paramVal = inputParams.map((inputParam) => {
        if (typeof inputParam === "object" &&
            inputParam !== null &&
            typeof inputParam.value === "string") {
            return inputParam.value.trim();
        }
        else if (typeof inputParam === "string") {
            return inputParam.trim();
        }
        return inputParam;
    });
    const params = paramFields.map((field, ind) => (Object.assign(Object.assign({}, field), { value: paramVal[ind] || null })));
    return params.reduce((memo, { type = "string", value }) => {
        if (value == null || value === "")
            return opts.emptyAsNull ? [...memo, null] : memo;
        let converted = value;
        if (type.indexOf("Vec<") >= 0) {
            converted = converted.split(",").map((e) => e.trim());
            converted = converted.map((single) => (0, exports.isNumType)(type)
                ? single.indexOf(".") >= 0
                    ? Number.parseFloat(single)
                    : Number.parseInt(single)
                : single);
            return [...memo, converted];
        }
        if ((0, exports.isNumType)(type)) {
            converted =
                converted.indexOf(".") >= 0
                    ? Number.parseFloat(converted)
                    : Number.parseInt(converted);
        }
        return [...memo, converted];
    }, []);
}
exports.transformParams = transformParams;
function toUint8Array(json) {
    const str = JSON.stringify(json);
    var bytes = new Uint8Array(str.length);
    for (var iii = 0; iii < str.length; iii++) {
        bytes[iii] = str.charCodeAt(iii);
    }
    return Array.from(new Uint8Array(bytes));
}
exports.toUint8Array = toUint8Array;
function tohex(name) {
    return Buffer.from(name, "utf8").toString("hex");
}
exports.tohex = tohex;
function uriToHex(didUri) {
    return didUri
        .split(":")
        .map((part, i) => {
        switch (i) {
            case 0:
                return part;
            case 1:
                return "0x" + tohex(part);
            default:
                return tohex(part);
        }
    })
        .reduce((a, b) => `${a === "" ? "" : a + ":"}${b}`, "");
}
exports.uriToHex = uriToHex;
const convert = (from, to) => (str) => Buffer.from(str, from).toString(to);
exports.convert = convert;
exports.hexToUtf8 = (0, exports.convert)('hex', 'utf8');
//# sourceMappingURL=utils.js.map