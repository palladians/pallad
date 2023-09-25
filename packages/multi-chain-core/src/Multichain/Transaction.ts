import {
  Mina,
  SubmitTxArgs,
  SubmitTxResult,
  TransactionsByAddressesArgs,
  TxStatus,
  TxStatusArgs
} from '@palladxyz/mina-core'

type DarkMatterTransactionBody = {
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

export type MultiChainTransactionBody =
  | Mina.TransactionBody
  | DarkMatterTransactionBody

export type MultiChainTransactionStatusArgs = TxStatusArgs

export type MultiChainTransactionStatus = TxStatus

export type MultiChainSubmitTxArgs = SubmitTxArgs

export type MultiChainSubmitTxResult = SubmitTxResult

export type MultiChainTransactionsByAddressesArgs = TransactionsByAddressesArgs

export type MultiChainPaginatedTransactions =
  Mina.Paginated<Mina.TransactionBody>
