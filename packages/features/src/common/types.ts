type TokenId = number
type AccountAddress = string
type DateTime = string
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

export type Transaction = {
  amount: number
  blockHeight: number
  dateTime: DateTime
  failureReason: string | null
  fee: number
  from: AccountAddress
  to: AccountAddress
  hash: string
  isDelegation: boolean
  token: TokenId
  kind: TxKind
}

export type StructurizedTransaction = Transaction & {
  side: TxSide
  date: string
  time: string
  minaAmount: number
}

export type TrpcResponse<T> = {
  result: {
    data: T
  }
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
    firstPendingTransaction: any[]
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
