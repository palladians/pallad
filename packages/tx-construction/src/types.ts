import {
  PrivateKey,
  PublicKey,
  SignedLegacy
} from 'mina-signer/dist/node/mina-signer/src/TSTypes'
import * as Json from 'mina-signer/dist/node/mina-signer/src/TSTypes'

/**
 * Represents a key pair consisting of a public key and a private key.
 */
export type KeyPair = {
  publicKey: PublicKey
  privateKey: PrivateKey
}

/**
 * Represents the network type.
 * It can be either 'mainnet' or 'testnet'.
 */
export type NetworkType = 'mainnet' | 'testnet'

/**
 * Couldn't export this from @pallad/mina-core for some reason...
 */
export enum TransactionKind {
  PAYMENT = 'PAYMENT',
  STAKE_DELEGATION = 'STAKE_DELEGATION'
  // Add other kinds of transactions as needed
}
export type ConstructedTransaction =
  | (Json.Payment & { type: TransactionKind.PAYMENT })
  | (Json.StakeDelegation & { type: TransactionKind.STAKE_DELEGATION })

export type SignedTransaction = SignedLegacy<ConstructedTransaction>
