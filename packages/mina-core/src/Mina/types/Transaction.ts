import { InvalidStringError, OpaqueString } from '@palladxyz/util'
import {
  PublicKey,
  UInt32,
  UInt64
} from 'mina-signer/dist/node/mina-signer/src/TSTypes'

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
}

export enum TransactionKind {
  PAYMENT = 'PAYMENT',
  STAKE_DELEGATION = 'STAKE_DELEGATION'
  // Add other kinds of transactions as needed
}

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
