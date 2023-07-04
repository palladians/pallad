import {
  HealthCheckResponse,
  HealthCheckResponseData,
  SendDelegationResult,
  SendPaymentResult,
  SubmitTxArgs,
  TxSubmitProvider
} from '@palladxyz/mina-core'
import bs58check from 'bs58check'
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

  async submitTx(
    args: SubmitTxArgs
  ): Promise<SendPaymentResult | SendDelegationResult> {
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
      const result = (await request(this.minaGql, mutation, variables)) as
        | SendPaymentResult
        | SendDelegationResult

      let txHash: string
      if (
        args.kind === 'PAYMENT' &&
        (result as SendPaymentResult).sendPayment &&
        (result as SendPaymentResult).sendPayment.payment
      ) {
        txHash = (result as SendPaymentResult).sendPayment.payment.hash
      } else if (
        args.kind === 'STAKE_DELEGATION' &&
        (result as SendDelegationResult).sendDelegation &&
        (result as SendDelegationResult).sendDelegation.delegation
      ) {
        txHash = (result as SendDelegationResult).sendDelegation.delegation.hash
      } else {
        throw new Error('Invalid transaction result')
      }
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
