import type { Mina } from "@palladxyz/mina-core"
import type { Address, Chain } from "viem"

import type { Provider } from "../"

export interface TokenIdMap {
  [alias: string]: string
}

export type AccountInfoArgs = {
  publicKey: Mina.PublicKey | Address
  tokenMap?: TokenIdMap
  chainInfo?: Chain
}

export interface AccountInfo {
  balance: { total: number }
  nonce: number
  inferredNonce: number
  delegate?: string
  publicKey: Mina.PublicKey | Address
}

export interface AccountInfoProvider extends Provider {
  /**
   * Gets the account balance and information based on a public key.
   *
   * @param {Mina.PublicKey | Address} publicKey - Public Key of the account
   * @returns {AccountInfo} - An object with balance and account information
   */
  getAccountInfo: (
    args: AccountInfoArgs,
  ) => Promise<Record<string, AccountInfo>>
}
