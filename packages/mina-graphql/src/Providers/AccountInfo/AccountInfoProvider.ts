import {
  AccountInfo,
  AccountInfoArgs,
  AccountInfoProvider,
  HealthCheckResponse
  //HealthCheckResponseData
} from '@palladxyz/mina-core'
import { gql, request } from 'graphql-request'

import { getAccountBalance, healthCheckQuery } from './queries'

//type AccountInfoHealthCheckResponseData = {
//  syncStatus: string
//}

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
      const rawResponse: any = await request(
        this.minaGql as string,
        query,
        {},
        { 'Content-Type': 'application/json' }
      )
      console.log(`Received raw response: ${JSON.stringify(rawResponse)}`)

      let syncStatus
      if (typeof rawResponse === 'object' && rawResponse !== null) {
        if ('data' in rawResponse) {
          const data = rawResponse.data as { syncStatus?: string }
          syncStatus = data.syncStatus
        } else {
          syncStatus = rawResponse.syncStatus
        }
      }

      if (!syncStatus) {
        console.log('Unexpected response structure or syncStatus not found')
        return {
          ok: false,
          message: 'Unexpected response structure or syncStatus not found'
        }
      }

      console.log(`Extracted syncStatus: ${syncStatus}`)
      if (syncStatus === 'SYNCED') {
        console.log('Health check passed with SYNCED status.')
        return { ok: true }
      } else {
        console.log(`Health check failed. Sync status: ${syncStatus}`)
        return {
          ok: false,
          message: 'Health check failed due to invalid sync status'
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
      const data = (await request(this.minaGql as string, query, {
        publicKey: args.publicKey
      })) as AccountData
      console.log('Received response for account info:', data)

      if (!data || !data.account) {
        throw new Error('Invalid account data response')
      }
      return data.account
    } catch (error: unknown) {
      // this can fail if the account doesn't exist yet on the chain & if the node is not available
      // perform health check to see if the node is available
      const healthCheckResponse = await this.healthCheck()
      if (!healthCheckResponse.ok) {
        throw new Error('Node is not available')
      }
      // if the node is available, then the account doesn't exist yet
      // return an empty account
      console.log('Error in getAccountInfo, account does not exist yet!')
      return {
        balance: { total: 0 },
        nonce: 0,
        inferredNonce: 0,
        delegate: '',
        publicKey: args.publicKey
      }
    }
  }
}
