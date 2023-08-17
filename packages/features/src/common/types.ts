import { Mina } from '@palladxyz/mina-core'

type TokenId = number
type Nonce = number
type Epoch = number
type ChainId = string
type PublicKey = string

export enum TxKind {
  STAKE_DELEGATION = 'STAKE_DELEGATION',
  PAYMENT = 'PAYMENT'
}

export enum TxSide {
  INCOMING = 'INCOMING',
  OUTGOING = 'OUTGOING'
}

export type StructurizedTransaction = Mina.TransactionBody & {
  side: TxSide
  date: string
  time: string
  minaAmount: number
}

type StakingAccount = {
  pk: string
  balance: string
  delegate: string
  token: TokenId
  nonce: Nonce
  receipt_chain_hash: string
  voting_for: string
  epoch: Epoch
  chainId: ChainId
  ledgerHash: string
  public_key: PublicKey
}

export type Account = {
  account: {
    publicKey: string
    balance: {
      total: string
      unknown: string
      blockHeight: number
      lockedBalance: number | null
    }
    nonce: Nonce
    receiptChainHash: string
    delegate: string
    votingFor: string
    totalTx: number
    totalBlocks: number
    totalSnarks: number
    countPendingTransactions: number
    firstPendingTransaction: unknown[]
    username: string
    epochStakingAccount: StakingAccount[]
    nextEpochStakingAccount: StakingAccount[]
    epochTotalStakingBalance: string
    nextEpochTotalStakingBalance: string
  }
  status: {
    syncStatus: string
    blockchainLength: number
  }
}

export type Contact = {
  name: string
  address: string
}

export type OutgoingTransaction = {
  to: string
  amount: string
  fee: string
  memo: string
}
