type IssuerURI = string;

interface IssuerObject {
  id: string;
  [x: string]: any;
}

export type Issuer = IssuerURI | IssuerObject;
