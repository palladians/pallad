import {
  ChainHistoryProvider,
  Mina,
  TransactionsByAddressesArgs,
  TransactionsByIdsArgs
} from '@palladxyz/mina-core'

import { createGraphQLRequest } from '../utils/fetch-utils'
import {
  healthCheck,
  healthCheckQueryArchive
} from '../utils/health-check-utils'
import { transactionsByAddressesQuery } from './queries'

export const createChainHistoryProvider = (
  url: string
): ChainHistoryProvider => {
  const transactionsByAddresses = async (
    args: TransactionsByAddressesArgs
  ): Promise<Mina.Paginated<Mina.TransactionBody>> => {
    const { startAt, limit } = args.pagination || { startAt: 0, limit: 10 }
    // TODO: remove array of addresses from TransactionsByAddressesArgs
    const variables = { address: args.addresses[0], limit, offset: startAt }
    const query = transactionsByAddressesQuery
    const fetchGraphQL = createGraphQLRequest(url)
    const result = await fetchGraphQL(query, variables)

    if (!result.ok) {
      throw new Error(result.message)
    }

    const transactions = result.data

    return transactions
  }

  const transactionsByHashes = async (
    args: TransactionsByIdsArgs
  ): Promise<Mina.TransactionBody[]> => {
    const variables = { ids: args.ids }
    const query = transactionsByAddressesQuery
    const fetchGraphQL = createGraphQLRequest(url)
    const result = await fetchGraphQL(query, variables)

    if (!result.ok) {
      throw new Error(result.message)
    }

    const transactions = result.data

    return transactions
  }

  return {
    healthCheck: () => healthCheck(url, healthCheckQueryArchive),
    transactionsByAddresses,
    transactionsByHashes
  }
}
