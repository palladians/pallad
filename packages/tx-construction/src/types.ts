import {
  PrivateKey,
  PublicKey,
  UInt64
} from 'mina-signer/dist/node/mina-signer/src/TSTypes'
/**
 * Represents a key pair consisting of a public key and a private key.
 */
export type KeyPair = {
  publicKey: PublicKey
  privateKey: PrivateKey
}

/**
 * Represents the body of a transaction.
 */
export type TransactionBody = {
  type: 'payment' | 'delegation' | 'zkApp'
  to: PublicKey
  from: PublicKey
  fee: UInt64
  nonce: UInt64
  amount?: UInt64
  memo?: string
  validUntil?: UInt64
}

/**
 * Represents the network type.
 * It can be either 'mainnet' or 'testnet'.
 */
export type NetworkType = 'mainnet' | 'testnet'
