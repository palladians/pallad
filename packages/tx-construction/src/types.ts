/**
 * Represents a key pair consisting of a public key and a private key.
 */
export type KeyPair = {
  publicKey: string
  privateKey: string
}

/**
 * Represents the body of a transaction.
 */
export type TransactionBody = {
  type: 'payment' | 'delegation' | 'zkApp'
  to: string
  from: string
  fee: string
  nonce: string
  amount?: string
  memo?: string
  validUntil?: string
}

/**
 * Represents the network type.
 * It can be either 'mainnet' or 'testnet'.
 */
export type NetworkType = 'mainnet' | 'testnet'
