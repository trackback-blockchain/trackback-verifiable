export declare type ExtrinsicResults = {
    [key: string]: any;
} | null;
export declare const DistributedStorageOptions: {
    url: string;
    api: string;
    decentralisedStoreURL: string;
};
export declare const DefaultOptions: {
    url: string;
    options: {
        types: {
            VerifiableCredential: {
                account_id: string;
                public_key: string;
                block_time_stamp: string;
                active: string;
            };
            DID: {
                did_resolution_metadata: string;
                did_document_metadata: string;
                block_number: string;
                block_time_stamp: string;
                updated_timestamp: string;
                did_ref: string;
                sender_account_id: string;
                public_keys: string;
            };
        };
        rpc: {
            didModule: {
                dIDDocument: {
                    description: string;
                    params: {
                        name: string;
                        type: string;
                    }[];
                    type: string;
                };
            };
        };
    };
};
export declare const Utils: {
    paramConversion: {
        num: string[];
    };
};
export declare const isNumType: (type: string) => boolean;
export declare function transformParams(paramFields: any[], inputParams: any[], opts?: {
    emptyAsNull: boolean;
}): any;
export declare function toUint8Array(json: any): number[];
export declare function tohex(name: string): string;
export declare function uriToHex(didUri: string): string;
export declare const convert: (from: any, to: any) => (str: any) => string;
export declare const hexToUtf8: (str: any) => string;
//# sourceMappingURL=helpers.d.ts.map