export type KeyPair = {
  publicKey: string
  privateKey: string
}

export type TransactionBody = {
  type: 'payment' | 'delegation' | 'zkApp'
  to: string
  from: string
  fee: string
  nonce: string
  amount?: string
  memo?: string
  validUntil?: string
}

export type NetworkType = 'mainnet' | 'testnet'
