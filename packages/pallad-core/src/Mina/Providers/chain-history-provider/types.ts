import type { Mina } from "@palladco/mina-core"
import type { Range } from "@palladco/util"

import type { Provider } from "../.."

export interface TransactionsByAddressesArgs {
  addresses: Mina.PaymentAddress[]
  pagination?: Mina.PaginationArgs
  blockRange?: Range<typeof Mina.BlockNo>
}

export type TransactionsByIdsArgs = { ids: Mina.TxId[] }
export type PaginatedTransaction = Mina.Paginated<Mina.TransactionBody>

export interface ChainHistoryProvider extends Provider {
  /**
   * Gets the transactions involving the provided addresses.
   * It's also possible to provide a block number to only look for transactions since that block inclusive
   *
   * @param {Mina.PaymentAddress[]} addresses array of addresses
   * @param {Mina.PaginationArgs} [pagination] pagination args
   * @param {Range<Mina.BlockNo>} [blockRange] transactions in specified block ranges (lower and upper bounds inclusive)
   * @returns {Mina.TransactionBody[]} an array of transactions involving the addresses
   */
  transactionsByAddresses: (
    args: TransactionsByAddressesArgs,
  ) => Promise<Mina.TransactionBody[] | undefined>

  /**
   * Gets the transactions matching the provided hashes.
   *
   * @param {Mina.TxId[]} ids array of transaction ids
   * @returns {Mina.TransactionBody[]} an array of transactions
   */
  transactionsByHashes: (
    args: TransactionsByIdsArgs,
  ) => Promise<Mina.TransactionBody[] | undefined>
}
