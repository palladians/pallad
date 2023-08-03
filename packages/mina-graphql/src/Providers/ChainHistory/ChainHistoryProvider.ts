import {
  ChainHistoryProvider,
  HealthCheckResponse,
  HealthCheckResponseData,
  Mina,
  TransactionsByAddressesArgs,
  TransactionsByIdsArgs
} from '@palladxyz/mina-core'
import { gql, request } from 'graphql-request'

import {
  healthCheckQuery,
  transactionsByAddressesQuery,
  transactionsByHashesQuery
} from './queries'

interface TransactionData {
  transaction: Mina.TransactionBody
}

interface TransactionsData {
  transactions: Mina.TransactionBody[]
}

export class ChainHistoryGraphQLProvider implements ChainHistoryProvider {
  private minaGql: string | null

  constructor(minaGql: string) {
    this.minaGql = minaGql
  }

  public async destroy(): Promise<void> {
    console.log('Destroying ChainHistoryGraphQLProvider...')
    this.minaGql = null
  }

  async changeNetwork(minaGql: string): Promise<void> {
    this.minaGql = minaGql
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    const query = gql`
      ${healthCheckQuery}
    `

    try {
      const data = (await request(
        this.minaGql as string,
        query
      )) as HealthCheckResponseData

      if (data && data.__schema && data.__schema.types.length > 0) {
        return { ok: true }
      } else {
        return { ok: false, message: 'Invalid schema response' }
      }
    } catch (error: unknown) {
      let errorMessage: string

      if (error instanceof Error) {
        errorMessage = error.message
      } else {
        errorMessage = 'Unknown error'
      }

      return { ok: false, message: errorMessage }
    }
  }

  async transactionsByAddresses(
    args: TransactionsByAddressesArgs
  ): Promise<Mina.Paginated<Mina.TransactionBody>> {
    const query = gql`
      ${transactionsByAddressesQuery}
    `

    const { startAt, limit } = args.pagination || { startAt: 0, limit: 10 }

    const data = (await request(this.minaGql as string, query, {
      address: args.addresses[0],
      limit,
      offset: startAt
    })) as TransactionsData

    // Assuming the 'transactions' field in the response contains the array of transactions.
    const transactions = data.transactions

    // May need to fetch the totalResultCount in a separate query if not returned by the server
    const totalResultCount = transactions.length

    return {
      pageResults: transactions,
      totalResultCount
    }
  }

  async transactionsByHashes(
    args: TransactionsByIdsArgs
  ): Promise<Mina.TransactionBody[]> {
    const query = gql`
      ${transactionsByHashesQuery}
    `

    const transactions = await Promise.all(
      args.ids.map(async (id: string) => {
        const data = (await request(this.minaGql as string, query, {
          hash: id
        })) as TransactionData
        return data.transaction
      })
    )

    return transactions
  }
}
