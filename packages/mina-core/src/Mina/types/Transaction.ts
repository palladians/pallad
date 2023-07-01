import { InvalidStringError, OpaqueString } from '@palladxyz/util'
export type Transaction = {
  amount: number
  blockHeight: number
  dateTime: string
  failureReason: string
  fee: number
  from: string
  hash: string
  id?: string
  isDelegation: boolean
  kind: TransactionKind
  memo: string
  nonce: number
  to: string
  token: string
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
