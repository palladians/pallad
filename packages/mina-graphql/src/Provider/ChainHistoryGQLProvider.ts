import {
  ChainHistoryProvider,
  HealthCheckResponse,
  HealthCheckResponseData,
  Mina,
  TransactionsByAddressesArgs,
  TransactionsByIdsArgs
} from '@palladxyz/mina-core'
import { gql, request } from 'graphql-request'

interface TransactionData {
  transaction: Mina.Transaction
}

interface TransactionsData {
  transactions: Mina.Transaction[]
}

export class ChainHistoryGraphQLProvider implements ChainHistoryProvider {
  private minaExplorerGql: string

  constructor(minaExplorerGql: string) {
    this.minaExplorerGql = minaExplorerGql
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    const query = gql`
      {
        __schema {
          types {
            name
          }
        }
      }
    `

    try {
      const data = (await request(
        this.minaExplorerGql,
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
  ): Promise<Mina.Paginated<Mina.Transaction>> {
    const query = gql`
      query Transactions($address: String!, $limit: Int, $offset: Int) {
        transactions(
          query: { canonical: true, OR: [{ to: $address }, { from: $address }] }
          limit: $limit
          offset: $offset
        ) {
          amount
          to
          token
          kind
          isDelegation
          hash
          from
          fee
          failureReason
          dateTime
          blockHeight
        }
      }
    `

    const { startAt, limit } = args.pagination || { startAt: 0, limit: 10 }

    const data = (await request(this.minaExplorerGql, query, {
      address: args.addresses[0],
      limit,
      offset: startAt
    })) as TransactionsData

    // Assuming the 'transactions' field in the response contains the array of transactions.
    const transactions = data.transactions

    // You may need to fetch the totalResultCount in a separate query if not returned by the server
    const totalResultCount = transactions.length

    return {
      pageResults: transactions,
      totalResultCount
    }
  }

  async transactionsByHashes(
    args: TransactionsByIdsArgs
  ): Promise<Mina.Transaction[]> {
    const query = gql`
      query Transaction($hash: String!) {
        transaction(query: { hash: $hash }) {
          amount
          blockHeight
          dateTime
          failureReason
          fee
          from
          hash
          id
          isDelegation
          kind
          memo
          nonce
          to
          token
        }
      }
    `

    const transactions = await Promise.all(
      args.ids.map(async (id: string) => {
        const data = (await request(this.minaExplorerGql, query, {
          hash: id
        })) as TransactionData
        return data.transaction
      })
    )

    return transactions
  }
}
