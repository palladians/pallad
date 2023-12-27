import {
  AccountInfo,
  AccountInfoArgs,
  AccountInfoProvider,
  HealthCheckResponse
} from '@palladxyz/mina-core'
import { gql, GraphQLClient } from 'graphql-request'

import { getAccountBalance, healthCheckQuery } from './queries'

export interface AccountData {
  account: AccountInfo
}

export class AccountInfoGraphQLProvider implements AccountInfoProvider {
  private minaGql: string | null

  constructor(minaGql: string) {
    this.minaGql = minaGql
  }

  public async destroy(): Promise<void> {
    console.log('Destroying AccountInfoGraphQLProvider...')
    this.minaGql = null
  }

  async changeNetwork(minaGql: string): Promise<void> {
    this.minaGql = minaGql
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    console.log('Initiating health check...')
    const query = gql`
      ${healthCheckQuery}
    `

    try {
      console.log(`Sending GraphQL request to: ${this.minaGql}`)
      const client = new GraphQLClient(this.minaGql as string, {
        errorPolicy: 'all'
      })
      const rawResponse: any = await client.request(query)

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
    console.log('Initiating getAccountInfo with args:', args)
    const query = gql`
      ${getAccountBalance}
    `

    try {
      console.log('Sending request for account info...')
      // redundant creation of client, but this is a temporary solution
      const client = new GraphQLClient(this.minaGql as string, {
        errorPolicy: 'all'
      })
      const data = (await client.request(query, {
        publicKey: args.publicKey
      })) as AccountData

      if (!data || !data.account) {
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
      return data.account
    } catch (error) {
      console.error('Error in getAccountInfo:', error)
      throw new Error('Error fetching account info')
    }
  }
}
