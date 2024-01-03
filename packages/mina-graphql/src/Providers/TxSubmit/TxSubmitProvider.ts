import {
  HealthCheckResponse,
  HealthCheckResponseData,
  SubmitTxArgs,
  SubmitTxResult,
  TxSubmitProvider
} from '@palladxyz/mina-core'
import { gql, GraphQLClient } from 'graphql-request'

import { customFetch, defaultJsonSerializer, ErrorPolicy } from '../utils'
import { getStakeTxSend, getTxSend } from './mutations'
import { healthCheckQuery } from './queries'

export class TxSubmitGraphQLProvider implements TxSubmitProvider {
  graphqlClient: GraphQLClient

  constructor(
    minaGql: string,
    errorPolicy: ErrorPolicy = 'ignore',
    fetch?: typeof customFetch
  ) {
    this.graphqlClient = new GraphQLClient(minaGql, {
      errorPolicy: errorPolicy,
      jsonSerializer: defaultJsonSerializer,
      fetch: fetch || customFetch
    })
  }

  public async destroy(): Promise<void> {
    console.log('Destroying TxSubmitGraphQLProvider...')
  }

  async changeNetwork(minaGql: string): Promise<void> {
    this.graphqlClient = new GraphQLClient(
      minaGql,
      this.graphqlClient.requestConfig
    )
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    const query = gql`
      ${healthCheckQuery}
    `

    try {
      const data =
        await this.graphqlClient.rawRequest<HealthCheckResponseData>(query)

      if (data && data.data.__schema && data.data.__schema.types.length > 0) {
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
      const result = await this.graphqlClient.rawRequest<SubmitTxResult>(
        mutation,
        variables
      )
      return result.data
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
