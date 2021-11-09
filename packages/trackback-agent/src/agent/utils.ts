export type ExtrinsicResults = {
  [key: string]: any;
} | null;


export const DistributedStorageOptions = {
  url: "https://ipfs-connector.trackback.dev",
  api: "/api/0.1/",
  decentralisedStoreURL: "https://ipfs.trackback.dev:8080/ipfs/"
}

export const DefaultOptions = {
  url: "ws://ec2-13-210-205-180.ap-southeast-2.compute.amazonaws.com:9944",
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
      "PeerId": "(Vec<u8>)"
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

export const Utils = {
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

export const isNumType = (type: string) =>
  Utils.paramConversion.num.some((el) => type.indexOf(el) >= 0);

export function transformParams(
  paramFields: any[],
  inputParams: any[],
  opts = { emptyAsNull: true }
) {
  const paramVal = inputParams.map(
    (inputParam: { value: string } | null | string) => {
      if (
        typeof inputParam === "object" &&
        inputParam !== null &&
        typeof inputParam.value === "string"
      ) {
        return inputParam.value.trim();
      } else if (typeof inputParam === "string") {
        return inputParam.trim();
      }
      return inputParam;
    }
  );
  const params = paramFields.map((field: any, ind: number) => ({
    ...field,
    value: paramVal[ind] || null,
  }));

  return params.reduce((memo: any, { type = "string", value }: any) => {
    if (value == null || value === "")
      return opts.emptyAsNull ? [...memo, null] : memo;

    let converted = value;

    if (type.indexOf("Vec<") >= 0) {
      converted = converted.split(",").map((e: string) => e.trim());
      converted = converted.map((single: string) =>
        isNumType(type)
          ? single.indexOf(".") >= 0
            ? Number.parseFloat(single)
            : Number.parseInt(single)
          : single
      );
      return [...memo, converted];
    }

    if (isNumType(type)) {
      converted =
        converted.indexOf(".") >= 0
          ? Number.parseFloat(converted)
          : Number.parseInt(converted);
    }
    return [...memo, converted];
  }, []);
}

export function toUint8Array(json: any): number[] {
  const str = JSON.stringify(json);

  var bytes = new Uint8Array(str.length);

  for (var iii = 0; iii < str.length; iii++) {
    bytes[iii] = str.charCodeAt(iii);
  }

  return Array.from(new Uint8Array(bytes));
}

export function tohex(name: string): string {
  return Buffer.from(name, "utf8").toString("hex");
}

export function uriToHex(didUri: string) {
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

export const convert = (from:any, to:any) => (str:any) => Buffer.from(str, from).toString(to);
export const hexToUtf8 = convert('hex', 'utf8');