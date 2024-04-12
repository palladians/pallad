import { Address } from 'viem'

import { Provider } from '../provider'

export type AccountInfoArgs = {
  publicKey: Address // Use Address type for public key
}

export interface AccountInfo {
  balance: { total: number }
  nonce: number
  inferredNonce: number
  delegate: string // no concept of delegating in Optimsim
  publicKey: Address
}

export interface AccountInfoProvider extends Provider {
  /**
   * Gets the account balance and information based on an address.
   *
   * @param {Address} publicKey - Address of the account
   * @returns {Record<string, AccountInfo>} - An object mapping token symbols to account information
   */
  getAccountInfo: (
    args: AccountInfoArgs
  ) => Promise<Record<string, AccountInfo>>
}
