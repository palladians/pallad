import { InvalidStringError, type OpaqueString } from "@palladxyz/util"

import type { BorrowedTypes } from ".."

/**
 * Represents the body of a transaction.
 */
export type TransactionBody = {
  type: TransactionType
  to: BorrowedTypes.PublicKey
  from: BorrowedTypes.PublicKey
  fee: BorrowedTypes.UInt64
  nonce: BorrowedTypes.UInt32
  amount?: BorrowedTypes.UInt64
  memo?: string
  validUntil?: BorrowedTypes.UInt32
  blockHeight?: number
  token?: string
  hash?: string
  failureReason?: string
  dateTime?: string
  isDelegation?: boolean
}

export enum TransactionType {
  PAYMENT = "payment",
  STAKE_DELEGATION = "delegation",
  ZK_APP = "zkApp",
  // Add other kinds of transactions as needed
}

/**
 * Represents a key pair consisting of a public key and a private key.
 */
export type KeyPair = {
  publicKey: BorrowedTypes.PublicKey
  privateKey: BorrowedTypes.PrivateKey
}

/**
 * Represents the network type.
 * It can be either 'mainnet' or 'testnet'.
 */
export type NetworkType = "mainnet" | "testnet"

/**
 * transaction hash as base64 string
 */
export type TxId = OpaqueString<"TransactionId">

/**
 * @param {string} value transaction hash as base64 string
 * @throws InvalidStringError
 */
export const TransactionId = (value: string): TxId => {
  if (!isBase64(value)) {
    throw new InvalidStringError("Not a valid base64 string")
  }
  return value as TxId
}

function isBase64(value: string): boolean {
  try {
    return btoa(atob(value)) === value
  } catch (err) {
    return false
  }
}
