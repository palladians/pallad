import {
  HealthCheckResponse,
  HealthCheckResponseData,
  SubmitTxArgs,
  SubmitTxResult,
  TxSubmitProvider
} from '@palladxyz/mina-core'
import { gql, request } from 'graphql-request'

import { getStakeTxSend, getTxSend } from './mutations'
import { healthCheckQuery } from './queries'

export class TxSubmitGraphQLProvider implements TxSubmitProvider {
  private minaGql: string | null

  constructor(minaGql: string) {
    this.minaGql = minaGql
  }

  public async destroy(): Promise<void> {
    console.log('Destroying TxSubmitGraphQLProvider...')
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

  async submitTx(args: SubmitTxArgs): Promise<SubmitTxResult> {
    const isRawSignature = typeof args.signedTransaction.signature === 'string'
    let mutation
    if (args.kind === 'payment') {
      mutation = gql`
        ${getTxSend(isRawSignature)}
      `
    } else {
      mutation = gql`
        ${getStakeTxSend(isRawSignature)}
      `
    }

    const variables = {
      ...args.transactionDetails,
      field: args.signedTransaction.signature.field,
      scalar: args.signedTransaction.signature.scalar
    }

    try {
      const result = (await request(
        this.minaGql as string,
        mutation,
        variables
      )) as SubmitTxResult
      return result
    } catch (error: unknown) {
      let errorMessage: string

      if (error instanceof Error) {
        errorMessage = error.message
      } else {
        errorMessage = 'Unknown error'
      }

      throw new Error(`Transaction submission failed: ${errorMessage}`)
    }
  }
}
