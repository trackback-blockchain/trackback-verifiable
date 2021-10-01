import {CredentialBuilder} from '../src/vc'

const issuer = new CredentialBuilder()
issuer.setCredentialSubject({id:""});
issuer.setIssuer("https://example.edu/issuers/14")

console.log(issuer.build())