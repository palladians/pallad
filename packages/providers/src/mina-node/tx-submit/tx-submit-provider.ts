import {
  SubmitTxArgs,
  SubmitTxResult,
  TxSubmitProvider
} from '@palladxyz/mina-core'

import { createGraphQLRequest } from '../utils/fetch-utils'
import { healthCheck } from '../utils/health-check-utils'
import { getStakeTxSend, getTxSend } from './mutations'

export const createTxSubmitProvider = (url: string): TxSubmitProvider => {
  const submitTx = async (args: SubmitTxArgs): Promise<SubmitTxResult> => {
    const isRawSignature = typeof args.signedTransaction.signature === 'string'
    let mutation
    if (args.kind === 'payment') {
      mutation = `
            ${getTxSend(isRawSignature)}
          `
    } else {
      mutation = `
            ${getStakeTxSend(isRawSignature)}
          `
    }

    const variables = {
      ...args.transactionDetails,
      field: args.signedTransaction.signature.field,
      scalar: args.signedTransaction.signature.scalar
    }

    const fetchGraphQL = createGraphQLRequest(url)
    const result = await fetchGraphQL(mutation, variables)

    if (!result.ok) {
      throw new Error(result.message)
    }

    const submissionResult = result.data

    return submissionResult
  }

  return {
    healthCheck: () => healthCheck(url),
    submitTx
  }
}
