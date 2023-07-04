import {
  HealthCheckResponse,
  HealthCheckResponseData,
  TxStatus,
  TxStatusArgs,
  TxStatusProvider
} from '@palladxyz/mina-core'
import { gql, request } from 'graphql-request'

import { healthCheckQuery, transactionStatus } from './queries'

export class TxStatusGraphQLProvider implements TxStatusProvider {
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
  async checkTxStatus(args: TxStatusArgs): Promise<TxStatus> {
    const query = gql`
      ${transactionStatus}
    `

    const variables = {
      id: args.id
    }

    try {
      const data = (await request(this.minaGql, query, variables)) as {
        transactionStatus: 'PENDING' | 'INCLUDED' | 'UNKNOWN' | 'FAILED'
      }

      if (!data || !data.transactionStatus) {
        throw new Error('Invalid transaction status response')
      }

      return { status: data.transactionStatus }
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
