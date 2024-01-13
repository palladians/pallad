import {
  AccountInfo,
  AccountInfoArgs,
  AccountInfoProvider,
  HealthCheckResponse
} from '@palladxyz/mina-core'
import { gql, GraphQLClient } from 'graphql-request'

import {
  customFetch,
  defaultJsonSerializer,
  ErrorPolicy,
  ExtendedError,
  ServerError
} from '../utils'
import { getAccountBalance, healthCheckQuery } from './queries'

export interface AccountData {
  account: AccountInfo
}

export class AccountInfoGraphQLProvider implements AccountInfoProvider {
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
    console.log('Destroying AccountInfoGraphQLProvider...')
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
      // TODO: should this be request or rawRequest?
      // we can do this when standardising the same health check for all providers
      const rawResponse: any = await this.graphqlClient.request(query)

      // Check for syncStatus directly in the response
      const syncStatus = rawResponse.syncStatus || rawResponse.data?.syncStatus

      if (!syncStatus) {
        console.log('Sync status not found in response')
        return { ok: false, message: 'Sync status not found' }
      }

      console.log(`Extracted syncStatus: ${syncStatus}`)
      if (syncStatus === 'SYNCED') {
        console.log('Health check passed with SYNCED status.')
        return { ok: true }
      } else {
        console.log(`Health check failed. Sync status: ${syncStatus}`)
        return {
          ok: false,
          message: `Health check failed. Sync status: ${syncStatus}`
        }
      }
    } catch (error) {
      console.error('Error during GraphQL request:', error)
      return { ok: false, message: 'GraphQL request failed' }
    }
  }

  async getAccountInfo(args: AccountInfoArgs): Promise<AccountInfo> {
    const query = gql`
      ${getAccountBalance}
    `

    try {
      const data = await this.graphqlClient.rawRequest<AccountData>(query, {
        publicKey: args.publicKey
      })

      if (!data || !data.data.account) {
        const healthCheckResponse = await this.healthCheck()
        if (!healthCheckResponse.ok) {
          throw new Error('Node is not available')
        }
        return {
          balance: { total: 0 },
          nonce: 0,
          inferredNonce: 0,
          delegate: '',
          publicKey: args.publicKey
        }
      }

      return data.data.account
    } catch (error) {
      const errorText = (error as any).text as string | undefined
      if (errorText) {
        let statusCode = 0
        if (errorText.includes('503')) {
          statusCode = 503
        } else if (errorText.includes('500')) {
          statusCode = 500
        }

        if (statusCode > 0) {
          throw new ServerError(
            error as unknown as ExtendedError,
            statusCode,
            errorText
          )
        }
      }

      // Other error handling or rethrow
      throw new Error('Error fetching account info')
    }
  }
}
