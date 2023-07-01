import { SubmitTxArgs, TxSubmitProvider } from '@palladxyz/mina-core'
import { gql, request } from 'graphql-request'

import { getStakeTxSend, getTxSend } from './mutations' // Import the appropriate mutation functions

export class TxSubmitGraphQLProvider implements TxSubmitProvider {
  private minaGql: string

  constructor(minaGql: string) {
    this.minaGql = minaGql
  }

  async submitTx(args: SubmitTxArgs): Promise<void> {
    const isRawSignature = typeof args.signedTransaction.signature === 'string'
    let mutation
    if (args.signedTransaction.kind === 'payment') {
      mutation = gql`
        ${getTxSend(isRawSignature)}
      `
    } else {
      mutation = gql`
        ${getStakeTxSend(isRawSignature)}
      `
    }

    try {
      await request(this.minaGql, mutation, {
        ...args.signedTransaction,
        ...args.signedTransaction.signature
      })
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
