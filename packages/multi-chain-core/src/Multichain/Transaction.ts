import {
  Mina,
  SubmitTxArgs,
  SubmitTxResult,
  TransactionsByAddressesArgs,
  TxStatus,
  TxStatusArgs
} from '@palladxyz/mina-core'

type DarkMatterTransactionBody = {
  type: 'payment' | 'delegation' | 'zkApp'
  to: string
  from: string
  fee: number
  nonce: number
  amount?: number
  memo?: string
  validUntil?: number
  blockHeight?: number
  token?: string
  hash?: string
  failureReason?: string
  dateTime?: string
  isDelegation?: boolean
  kind?: Mina.TransactionKind // if this isn't a Mina type it breaks the @features package
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
