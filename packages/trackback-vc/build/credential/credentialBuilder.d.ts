import { CredentialStatus, CredentialSubject, Issuer } from '../types';
export declare class CredentialBuilder {
    private _context;
    private _type;
    private _credentialSubject?;
    private _issuer?;
    private _issuanceDate?;
    private _expirationDate?;
    private _id?;
    private _status?;
    setContext(context: string[]): this;
    setId(id: string): void;
    setType(types: string[]): this;
    setCredentialSubject(subject: CredentialSubject): this;
    setIssuer(issuer: Issuer): this;
    setCredentialStatus(status: CredentialStatus): this;
    /**
     * RFC_3339
     * @param {string} date RFC_3339 format
     * @returns
     */
    setIssuanceDate(date: string | Date): this;
    setExpirationDate(date: string | Date): this;
    build(): {
        [k: string]: string[] | CredentialSubject | Issuer | CredentialStatus | undefined;
    };
}
//# sourceMappingURL=credentialBuilder.d.ts.map