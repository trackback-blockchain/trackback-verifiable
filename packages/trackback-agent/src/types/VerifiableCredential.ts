export interface ICredential {
    '@context': string[]
    id?: string
    type: string[]
    issuer: { id: string;[x: string]: any }
    issuanceDate: string
    expirationDate?: string
    credentialSubject: {
        id?: string
        [x: string]: any
    }
    credentialStatus?: {
        id: string
        type: string
    }
    [x: string]: any
}


export interface VerifiableCredential {
    '@context': string[]
    id?: string
    type: string[]
    issuer: { id: string;[x: string]: any }
    issuanceDate: string
    expirationDate?: string
    credentialSubject: {
        id?: string
        [x: string]: any
    }
    credentialStatus?: {
        id: string
        type: string
    }
    proof: {
        type?: string
        [x: string]: any
    }
    [x: string]: any
}