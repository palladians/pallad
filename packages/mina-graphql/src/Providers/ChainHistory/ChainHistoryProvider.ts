import {
  ChainHistoryProvider,
  HealthCheckResponse,
  HealthCheckResponseData,
  Mina,
  TransactionsByAddressesArgs,
  TransactionsByIdsArgs
} from '@palladxyz/mina-core'
import { gql, GraphQLClient } from 'graphql-request'

import {
  customFetch,
  defaultJsonSerializer,
  ErrorPolicy,
  ExtendedError,
  ServerError
} from '../utils'
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
  private graphqlClient: GraphQLClient

  constructor(
    minaGql: string,
    errorPolicy: ErrorPolicy = 'ignore',
    fetch?: typeof customFetch
  ) {
    this.graphqlClient = new GraphQLClient(minaGql, {
      errorPolicy: errorPolicy,
      jsonSerializer: defaultJsonSerializer,
      fetch: fetch || customFetch
    })
  }

  private handleError(error: unknown): void {
    console.error('Error in ChainHistoryGraphQLProvider:', error)

    if (error instanceof Error && 'text' in error) {
      const errorText = (error as any).text as string | undefined
      if (errorText) {
        let statusCode = 0
        if (errorText.includes('503')) {
          statusCode = 503
        } else if (errorText.includes('500')) {
          statusCode = 500
        }

        if (statusCode > 0) {
          throw new ServerError(error as ExtendedError, statusCode, errorText)
        }
      }
    }

    throw new Error('Error processing GraphQL request')
  }

  public destroy(): void {
    console.log('Destroying ChainHistoryGraphQLProvider...')
  }

  changeNetwork(minaGql: string): void {
    this.graphqlClient = new GraphQLClient(
      minaGql,
      this.graphqlClient.requestConfig
    )
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    const query = gql`
      ${healthCheckQuery}
    `

    try {
      const data =
        await this.graphqlClient.rawRequest<HealthCheckResponseData>(query)

      if (data && data.data.__schema && data.data.__schema.types.length > 0) {
        return { ok: true }
      } else {
        return { ok: false, message: 'Invalid schema response' }
      }
    } catch (error: unknown) {
      this.handleError(error)
      return { ok: false, message: 'Error occurred' }
    }
  }

  async transactionsByAddresses(
    args: TransactionsByAddressesArgs
  ): Promise<Mina.Paginated<Mina.TransactionBody>> {
    const query = gql`
      ${transactionsByAddressesQuery}
    `

    const { startAt, limit } = args.pagination || { startAt: 0, limit: 10 }

    /*const data = (await request(this.minaGql as string, query, {
      address: args.addresses[0],
      limit,
      offset: startAt
    })) as TransactionsData*/
    const data = await this.graphqlClient.rawRequest<TransactionsData>(query, {
      address: args.addresses[0],
      limit,
      offset: startAt
    })

    // Assuming the 'transactions' field in the response contains the array of transactions.
    const transactions = data.data.transactions

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
        const data = await this.graphqlClient.rawRequest<TransactionData>(
          query,
          {
            hash: id
          }
        )
        return data.data.transaction
      })
    )

    return transactions
  }
}
