import {
  HealthCheckResponse,
  HealthCheckResponseData,
  SendTxResult,
  SubmitTxArgs,
  TxSubmitProvider
} from '@palladxyz/mina-core'
import { gql, request } from 'graphql-request'

import { getStakeTxSend, getTxSend } from './mutations'
import { healthCheckQuery } from './queries'

export class TxSubmitGraphQLProvider implements TxSubmitProvider {
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

  async submitTx(args: SubmitTxArgs): Promise<SendTxResult> {
    const isRawSignature = typeof args.signedTransaction.signature === 'string'
    let mutation
    if (args.kind === 'PAYMENT') {
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
        this.minaGql,
        mutation,
        variables
      )) as SendTxResult
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
