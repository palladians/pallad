import { TxStatus, TxStatusArgs, TxStatusProvider } from '@palladxyz/mina-core'

import { fetchGraphQL } from '../utils/fetch-utils'
import { healthCheck } from '../utils/health-check-utils'
import { transactionStatus as transactionStatusQuery } from './queries'

export const createTransactionStatusProvider = (
  url: string
): TxStatusProvider => {
  const checkTxStatus = async (args: TxStatusArgs): Promise<TxStatus> => {
    const variables = { id: args.ID }
    const result = await fetchGraphQL(url, transactionStatusQuery, variables)
    if (!result.ok) {
      throw new Error(result.message)
    }
    // TODO: Check why this query always returns "UNKNOWN"
    const transactionStatus = result.data.transactionStatus
    if (!transactionStatus) {
      return TxStatus.UNKNOWN
    }

    return transactionStatus as TxStatus
  }

  return {
    healthCheck: () => healthCheck(url),
    checkTxStatus
  }
}
