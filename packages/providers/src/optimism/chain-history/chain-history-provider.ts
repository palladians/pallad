import {
  ChainHistoryProvider,
  TransactionsByAddressesArgs,
  TransactionsByHashesArgs,
  Tx
} from '@palladxyz/pallad-core'
import {
  createPublicClient,
  GetTransactionParameters,
  Hash,
  webSocket
} from 'viem'

import { healthCheckOptimism } from '../utils'

// TODO: remove Mina types from providers & make viem providers in pallad-core
export const createChainHistoryProvider = (
  url: string
): ChainHistoryProvider => {
  const transactionsByAddresses = async (
    args: TransactionsByAddressesArgs
  ): Promise<Tx[]> => {
    // need an explorer or other third-party API to fetch transaction history
    console.log('the args are:', args)
    await new Promise((resolve) => setTimeout(resolve, 100))

    return []
  }

  // TODO: decouple Mina from these providers, maybe `@palladxyz/otpimism-core` ?
  const transactionsByHashes = async (
    args: TransactionsByHashesArgs
  ): Promise<Tx[]> => {
    const client = createPublicClient({
      chain: args.chainInfo,
      transport: webSocket(url)
    })
    const transactionArgs: GetTransactionParameters = {
      hash: args.ids[0] as Hash
    }
    const transactions = await client.getTransaction(transactionArgs)

    return transactions as any
  }

  return {
    healthCheck: () => healthCheckOptimism(url),
    transactionsByAddresses,
    transactionsByHashes
  }
}
