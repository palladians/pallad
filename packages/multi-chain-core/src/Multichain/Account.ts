import { AccountInfo } from '@palladxyz/mina-core'

export type DarkMatterAccountInfo = {
  balance: { total: number }
  nonce: number
  inferredNonce: number
  delegate: string
  publicKey: string
}

export type MultiChainAccountInfo = AccountInfo | DarkMatterAccountInfo
