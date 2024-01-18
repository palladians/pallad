import {
  ChainHistoryProvider,
  Mina,
  TransactionsByAddressesArgs,
  TransactionsByIdsArgs
} from '@palladxyz/mina-core'

import { fetchGraphQL } from '../utils/fetch-utils'
import { healthCheck } from '../utils/health-check-utils'
import { transactionsByAddressesQuery } from './queries'

export const createChainHistoryProvider = (
  url: string
): ChainHistoryProvider => {
  const transactionsByAddresses = async (
    args: TransactionsByAddressesArgs
  ): Promise<Mina.TransactionBody[]> => {
    const { startAt, limit } = args.pagination || { startAt: 0, limit: 10 }
    // TODO: remove array of addresses from TransactionsByAddressesArgs
    const variables = { address: args.addresses[0], limit, offset: startAt }
    const query = transactionsByAddressesQuery
    const result = await fetchGraphQL(url, query, variables)

    if (!result.ok) {
      throw new Error(result.message)
    }

    const transactions = result.data.transactions

    return transactions
  }

  const transactionsByHashes = async (
    args: TransactionsByIdsArgs
  ): Promise<Mina.TransactionBody[]> => {
    const variables = { ids: args.ids }
    const query = transactionsByAddressesQuery
    const result = await fetchGraphQL(url, query, variables)

    if (!result.ok) {
      throw new Error(result.message)
    }

    const transactions = result.data

    return transactions
  }

  return {
    healthCheck: () => healthCheck(url),
    transactionsByAddresses,
    transactionsByHashes
  }
}
