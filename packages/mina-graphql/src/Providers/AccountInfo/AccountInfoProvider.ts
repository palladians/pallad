import {
  AccountInfo,
  AccountInfoArgs,
  AccountInfoProvider,
  HealthCheckResponse,
  HealthCheckResponseData
} from '@palladxyz/mina-core'
import { gql, request } from 'graphql-request'

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
      console.log('Sending request for health check...')
      const data = (await request(
        this.minaGql as string,
        query
      )) as HealthCheckResponseData
      console.log('Received response for health check:', data)

      if (data && data.__schema && data.__schema.types.length > 0) {
        return { ok: true }
      } else {
        throw new Error('Invalid schema response')
      }
    } catch (error: unknown) {
      console.error('Error in healthCheck:', error)
      let errorMessage = 'Unknown error'
      if (error instanceof Error) {
        errorMessage = error.message
      }
      return { ok: false, message: errorMessage }
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
