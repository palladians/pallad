import { InvalidStringError, OpaqueString } from '@palladxyz/util'
import {
  PrivateKey,
  PublicKey,
  SignedLegacy,
  UInt32,
  UInt64
} from 'mina-signer/dist/node/mina-signer/src/TSTypes'
import * as Json from 'mina-signer/dist/node/mina-signer/src/TSTypes'

/**
 * Represents the body of a transaction.
 */
export type TransactionBody = {
  type: 'payment' | 'delegation' | 'zkApp'
  to: PublicKey
  from: PublicKey
  fee: UInt64
  nonce: UInt32
  amount?: UInt64
  memo?: string
  validUntil?: UInt32
  blockHeight?: number
  token?: string
  hash?: string
  failureReason?: string
  dateTime?: string
  isDelegation?: boolean
  kind?: TransactionKind
}

export enum TransactionKind {
  PAYMENT = 'payment',
  STAKE_DELEGATION = 'delegation',
  ZK_APP = 'zkApp'
  // Add other kinds of transactions as needed
}

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

export type ConstructedTransaction =
  | (Json.Payment & { type: TransactionKind.PAYMENT })
  | (Json.StakeDelegation & { type: TransactionKind.STAKE_DELEGATION })

export type SignedTransaction = SignedLegacy<ConstructedTransaction>

/**
 * transaction hash as base64 string
 */
export type TransactionId = OpaqueString<'TransactionId'>

/**
 * @param {string} value transaction hash as base64 string
 * @throws InvalidStringError
 */
export const TransactionId = (value: string): TransactionId => {
  if (!isBase64(value)) {
    throw new InvalidStringError('Not a valid base64 string')
  }
  return value as TransactionId
}

function isBase64(value: string): boolean {
  try {
    return btoa(atob(value)) === value
  } catch (err) {
    return false
  }
}
