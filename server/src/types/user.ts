export interface PublicKey {
  id: string;
  owner: string;
  publicKeyPem: string;
}

export interface User {
  iri: string;
  preferredUsername?: string;
  displayName?: string;
  inbox: string;
  outbox: string;
  followers?: string;
  following?: string;
  publicKey: PublicKey;
  privateKeyPem?: string;
  isLocal: boolean;
  googleSub?: string;
} 