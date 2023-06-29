export type KeyPair = {
  publicKey: string
  privateKey: string
}

export type TransactionBody = {
  to: string
  from: string
  fee: string
  nonce: string
  amount?: string
  memo?: string
  validUntil?: string
}
