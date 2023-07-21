import {
  AccountInfo,
  AccountInfoArgs,
  AccountInfoProvider,
  HealthCheckResponse,
  HealthCheckResponseData
} from '@palladxyz/mina-core'
import { gql, request } from 'graphql-request'

import { getAccountBalance, healthCheckQuery } from './queries'

interface AccountData {
  account: AccountInfo
}

export class AccountInfoGraphQLProvider implements AccountInfoProvider {
  private minaGql: string

  constructor(minaGql: string) {
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
        this.minaGql,
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
      const data = (await request(this.minaGql, query, {
        publicKey: args.publicKey
      })) as AccountData
      console.log('Received response for account info:', data)

      if (!data || !data.account) {
        throw new Error('Invalid account data response')
      }
      return data.account
    } catch (error: unknown) {
      console.error('Error in getAccountInfo:', error)
      throw error
    }
  }
}
