import { AccountInfo, AccountInfoArgs } from '@palladxyz/mina-core'

type DarkMatterAccountInfo = {
  balance: { total: number }
  nonce: number
  inferredNonce: number
  delegate: string
  publicKey: string
}

export type MultiChainAccountInfo = AccountInfo | DarkMatterAccountInfo

export type MultiChainAccountInfoArgs = AccountInfoArgs
