import {
  AccountInfo,
  AccountInfoArgs,
  AccountInfoProvider,
  HealthCheckResponse
  //HealthCheckResponseData
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

type AccountInfoHealthCheckResponseData = {
  data: {
    syncStatus: string
  }
}

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
    console.log('Initiating health check...')
    const query = gql`
      ${healthCheckQuery}
    `

    try {
      const response = await request(this.minaGql as string, query)
      // Adjust this part based on the actual structure of your response
      const data = response as AccountInfoHealthCheckResponseData
      const syncStatus = data.data ? data.data.syncStatus : null

      if (syncStatus === 'SYNCED') {
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
    console.log('Initiating getAccountInfo with args:', args)
    const query = gql`
      ${getAccountBalance}
    `

    try {
      console.log('Sending request for account info...')
      const data = await this.graphqlClient.rawRequest<AccountData>(query, {
        publicKey: args.publicKey
      })

      if (!data || !data.data.account) {
        console.log('Account data not found, performing health check...')
        const healthCheckResponse = await this.healthCheck()
        if (!healthCheckResponse.ok) {
          throw new Error('Node is not available')
        }
        console.log('Account does not exist yet, returning empty account.')
        return {
          balance: { total: 0 },
          nonce: 0,
          inferredNonce: 0,
          delegate: '',
          publicKey: args.publicKey
        }
      }

      console.log('Received response for account info:', data)
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
