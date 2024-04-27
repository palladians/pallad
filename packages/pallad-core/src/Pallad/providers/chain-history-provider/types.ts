import type { Chain } from "viem"

import type { ChainAddress, Provider, Tx, TxHash } from "../.."

export interface TransactionsByAddressesArgs {
  addresses: ChainAddress[]
  chainInfo?: Chain
}

export type TransactionsByHashesArgs = { ids: TxHash; chainInfo?: Chain }

export interface ChainHistoryProvider extends Provider {
  /**
   * Gets the transactions involving the provided addresses.
   * It's also possible to provide a block number to only look for transactions since that block inclusive
   *
   * @param {ChainAddress[]} addresses array of addresses
   * @returns {Tx[]} an array of transactions involving the addresses
   */
  transactionsByAddresses: (args: TransactionsByAddressesArgs) => Promise<Tx[]>

  /**
   * Gets the transactions matching the provided hashes.
   *
   * @param {TransactionHash[]} hashes array of transaction ids
   * @returns {Tx[]} an array of transactions
   */
  transactionsByHashes: (args: TransactionsByHashesArgs) => Promise<Tx[]>
}
