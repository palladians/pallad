import {
  HealthCheckResponse,
  HealthCheckResponseData,
  TxStatus,
  TxStatusArgs,
  TxStatusProvider
} from '@palladxyz/mina-core'
import { gql, GraphQLClient } from 'graphql-request'

import { customFetch, defaultJsonSerializer, ErrorPolicy } from '../utils'
import { healthCheckQuery, transactionStatus } from './queries'

export class TxStatusGraphQLProvider implements TxStatusProvider {
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

  public async destroy(): Promise<void> {
    console.log('Destroying TxStatusGraphQLProvider...')
  }

  async changeNetwork(minaGql: string): Promise<void> {
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
      let errorMessage: string

      if (error instanceof Error) {
        errorMessage = error.message
      } else {
        errorMessage = 'Unknown error'
      }

      return { ok: false, message: errorMessage }
    }
  }
  async checkTxStatus(args: TxStatusArgs): Promise<TxStatus> {
    const query = gql`
      ${transactionStatus}
    `

    const variables = {
      id: args.ID
    }

    try {
      const data = await this.graphqlClient.rawRequest<{
        transactionStatus: TxStatus
      }>(query, variables)

      if (!data || !data.data.transactionStatus) {
        throw new Error('Invalid transaction status response')
      }

      return data.data.transactionStatus as TxStatus
    } catch (error: unknown) {
      let errorMessage: string

      if (error instanceof Error) {
        errorMessage = error.message
      } else {
        errorMessage = 'Unknown error'
      }

      throw new Error(`Transaction status check failed: ${errorMessage}`)
    }
  }
}
