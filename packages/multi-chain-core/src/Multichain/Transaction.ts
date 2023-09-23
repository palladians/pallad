import { Mina } from '@palladxyz/mina-core'

export type DarkMatterTransactionBody = {
  amount: number
  fee: number
  nonce: number
  from: string
  to: string
  memo: string
  validUntil: number
  signature: string
  publicKey: string
}

export type MultiChainTransaction =
  | Mina.TransactionBody
  | DarkMatterTransactionBody
