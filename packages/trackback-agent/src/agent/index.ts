import { ITrackbackAgent, ITrackbackAgentOptions } from "../types";



const defaultOptions = {
    // url: 'wss://trackback.dev',
    url: 'ws://ec2-13-210-205-180.ap-southeast-2.compute.amazonaws.com:9944/',
    options: {
        types: {
            VerifiableCredential: {
                account_id: 'AccountId',
                public_key: 'Vec<8>',
                block_time_stamp: 'u64',
                active: 'bool',
            },
            DID: {
                did_resolution_metadata: 'Option<Vec<u8>>',
                // did_document: 'Vec<u8>',
                did_document_metadata: 'Option<Vec<u8>>',
                block_number: 'BlockNumber',
                block_time_stamp: 'u64',
                did_ref: 'Vec<u8>',
                sender_account_id: 'Vec<u8>',
            },

        },
        rpc: {
            didModule: {
                dIDDocument: {
                    description: 'Get DID Documnet',
                    params: [
                        {
                            name: 'didDocumentHash',
                            type: 'Vec<u8>',
                        },
                    ],
                    type: 'DID',
                },
            },
        },
    },
};


const utils = {
    paramConversion: {
        num: [
            'Compact<Balance>',
            'BalanceOf',
            'u8',
            'u16',
            'u32',
            'u64',
            'u128',
            'i8',
            'i16',
            'i32',
            'i64',
            'i128',
        ],
    },
};

const isNumType = (type: string) =>
    utils.paramConversion.num.some((el) => type.indexOf(el) >= 0);

function transformParams(
    paramFields: any[],
    inputParams: any[],
    opts = { emptyAsNull: true }
) {
    const paramVal = inputParams.map(
        (inputParam: { value: string } | null | string) => {
            if (
                typeof inputParam === 'object' &&
                inputParam !== null &&
                typeof inputParam.value === 'string'
            ) {
                return inputParam.value.trim();
            } else if (typeof inputParam === 'string') {
                return inputParam.trim();
            }
            return inputParam;
        }
    );
    const params = paramFields.map((field: any, ind: number) => ({
        ...field,
        value: paramVal[ind] || null,
    }));

    return params.reduce((memo: any, { type = 'string', value }: any) => {
        if (value == null || value === '')
            return opts.emptyAsNull ? [...memo, null] : memo;

        let converted = value;

        if (type.indexOf('Vec<') >= 0) {
            converted = converted.split(',').map((e: string) => e.trim());
            converted = converted.map((single: string) =>
                isNumType(type)
                    ? single.indexOf('.') >= 0
                        ? Number.parseFloat(single)
                        : Number.parseInt(single)
                    : single
            );
            return [...memo, converted];
        }

        // Deal with a single value
        if (isNumType(type)) {
            converted =
                converted.indexOf('.') >= 0
                    ? Number.parseFloat(converted)
                    : Number.parseInt(converted);
        }
        return [...memo, converted];
    }, []);
}


export class TrackBackAgent implements ITrackbackAgent {

    private options: ITrackbackAgentOptions;
    private api: Promise<ApiPromise> | null | undefined;

    constructor(options: ITrackbackAgentOptions = defaultOptions) {
        this.options = options;
    }

    private async connect(): Promise<ApiPromise> {
        if (this.api) return this.api;

        const { url, options: other } = this.options;
        const { types, rpc } = other;

        const provider = new WsProvider(url);

        this.api = ApiPromise.create({ provider: provider, types, rpc });
        return this.api;
    }

    async resolve(didUri: string): Promise<DIDDocument | null> {
        const didUriHex = this.uriToHex(didUri);
        console.log(didUriHex)
        return this.connect().then((api) => {
          return new Promise<DIDDocument>((resolve, reject) => {
            if (!api) return null;
            api.query.didModule.dIDDocument(didUriHex, (result: any) => {
              console.log(result);
              if (!result.isEmpty) {
                resolve(JSON.parse(result.toString()));
              } else {
                reject();
              }
            });
          }).catch((error) => {
            console.log(error);
            return null;
          });
        });
      }
    
      toUnit8Aaay(json: any): number[] {
        const str = JSON.stringify(json);
    
        var bytes = new Uint8Array(str.length);
        for (var iii = 0; iii < str.length; iii++) {
          bytes[iii] = str.charCodeAt(iii);
        }
    
        return Array.from(new Uint8Array(bytes));
      }
    
      tohex(name: string): string {
        return Buffer.from(name, 'utf8').toString('hex');
      }
    
    
      uriToHex(didUri: string) {
        return didUri
          .split(':')
          .map((part, i) => {
            switch (i) {
              case 0:
                return part;
              case 1:
                return '0x' + this.tohex(part);
    
              default:
                return this.tohex(part);
            }
          })
          .reduce((a, b) => `${a === '' ? '' : a + ':'}${b}`, '');
    
      }
    
      async save(
        account: IKeyringPair,
        didDocument: DIDDocument,
        didDocumentMetadata: DIDDocumentMetadata,
        dIDResolutionMetadata: DIDResolutionMetadata
      ): Promise<boolean> {
        const didDoc = this.toUnit8Aaay(didDocument);
        const didDocMetadata = this.toUnit8Aaay(didDocumentMetadata);
        const didDocRes = this.toUnit8Aaay(dIDResolutionMetadata);
    
        const palletRpc = 'didModule';
        const callable = 'insertDidDocument';
    
        const id = this.uriToHex(didDocument.id)
    
        console.log(id)
    
        const inputParams = [
          didDoc,
          didDocMetadata,
          didDocRes,
          account.address,
          id,
        ];
    
        const paramFields = [true, true, true, true, true];
    
        const transformed = transformParams(paramFields, inputParams);
    
        return this.saveToChain(account, palletRpc, callable, transformed);
      }
    
      async saveToChain(
        account: IKeyringPair,
        palletRpc: string,
        callable: string,
        transformed: any
      ): Promise<boolean> {
        return this.connect()
          .then((api) => {
            if (!api) return false;
    
            return api.rpc.system
              .accountNextIndex(account.address)
              .then((nonce) => {
                return new Promise<boolean>((resolve) => {
                  const txExecute = api.tx[palletRpc][callable](...transformed);
    
                  txExecute.signAndSend(account, { nonce }, (result: any) => {
                    console.log(`Current status is ${JSON.stringify(result)}`);
                    console.log(`Current nonce is ${nonce}`);
    
                    if (result.status.isInBlock) {
                      console.log(
                        `Transaction included at blockHash ${result.status.asInBlock}`
                      );
                    } else if (result.status.isFinalized) {
                      console.log(
                        `Transaction finalized at blockHash ${JSON.stringify(
                          result
                        )}`
                      );
                      resolve(result.status.isFinalized);
                    }
                  });
                });
              });
          })
          .catch((error) => {
            console.log(error);
            return false;
          });
      }
    
      generateDIDUri(account: IKeyringPair) {
        return `did:trackback:${blake2AsHex(account.address)}-${blake2AsHex(uuidv4() + "" + new Date().getMilliseconds())}`
      }

      createAccount(){
          return this.options.didManager.createAccount()
      }
    

}