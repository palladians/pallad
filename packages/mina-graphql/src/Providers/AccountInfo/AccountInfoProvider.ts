import {
  AccountBalance,
  AccountInfoArgs,
  AccountInfoProvider,
  HealthCheckResponse,
  HealthCheckResponseData
} from '@palladxyz/mina-core'
import { gql, request } from 'graphql-request'

import { getAccountBalance, healthCheckQuery } from './queries'

interface AccountData {
  account: AccountBalance
}

export class AccountInfoGraphQLProvider implements AccountInfoProvider {
  private minaGql: string

  constructor(minaGql: string) {
    this.minaGql = minaGql
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    const query = gql`
      ${healthCheckQuery}
    `

    try {
      const data = (await request(
        this.minaGql,
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

  async getAccountInfo(args: AccountInfoArgs): Promise<AccountBalance> {
    const query = gql`
      ${getAccountBalance}
    `
    const data = (await request(this.minaGql, query, {
      publicKey: args.publicKey
    })) as AccountData

    return data.account
  }
}
