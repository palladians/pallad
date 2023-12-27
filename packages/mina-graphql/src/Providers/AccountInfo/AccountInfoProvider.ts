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

    let rawResponse
    try {
      console.log(`Sending GraphQL request to: ${this.minaGql}`)
      rawResponse = await request(this.minaGql as string, query)
      console.log(`Received raw response: ${JSON.stringify(rawResponse)}`)
    } catch (error) {
      console.error('Error during GraphQL request:', error)
      return { ok: false, message: 'GraphQL request failed' }
    }

    // Process the response outside the try-catch block
    let jsonData
    if (typeof rawResponse === 'string') {
      console.log('Response is a string. Parsing to JSON...')
      jsonData = JSON.parse(rawResponse)
    } else {
      jsonData = rawResponse
    }
    console.log(`Parsed JSON data: ${JSON.stringify(jsonData)}`)

    const syncStatus = jsonData ? jsonData.syncStatus : null
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
