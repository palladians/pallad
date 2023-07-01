import { Mina, Provider } from '../..'

export type AccountInfoArgs = { publicKey: Mina.PublicKey }

export interface AccountBalance {
  balance: { total: number }
  nonce: number
  inferredNonce: number
  delegate: string
  publicKey: Mina.PublicKey
}

export interface AccountInfoProvider extends Provider {
  /**
   * Gets the account balance and information based on a public key.
   *
   * @param {Mina.PublicKey} publicKey - Public Key of the account
   * @returns {AccountBalance} - An object with balance and account information
   */
  getAccountInfo: (args: AccountInfoArgs) => Promise<AccountBalance>
}
