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
  private minaGql: string | null

  constructor(minaGql: string) {
    this.minaGql = minaGql
  }

  public async destroy(): Promise<void> {
    console.log('Destroying TxStatusGraphQLProvider...')
    this.minaGql = null
  }

  async changeNetwork(minaGql: string): Promise<void> {
    this.minaGql = minaGql
  }
  async healthCheck(): Promise<HealthCheckResponse> {
    const query = gql`
      ${healthCheckQuery}
    `

    try {
      const data = (await request(
        this.minaGql as string,
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
      id: args.ID
    }

    try {
      const data = (await request(
        this.minaGql as string,
        query,
        variables
      )) as {
        transactionStatus: 'PENDING' | 'INCLUDED' | 'UNKNOWN' | 'FAILED'
      }

      if (!data || !data.transactionStatus) {
        throw new Error('Invalid transaction status response')
      }

      return data.transactionStatus as TxStatus
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
