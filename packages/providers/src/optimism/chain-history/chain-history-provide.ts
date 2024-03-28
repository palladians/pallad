import {
  ChainHistoryProvider,
  Mina,
  TransactionsByAddressesArgs,
  TransactionsByIdsArgs
} from '@palladxyz/mina-core'
import { createPublicClient, GetTransactionParameters, Hash, http } from 'viem'
import { optimismSepolia } from 'viem/chains'

import { healthCheckOptimism } from '../utils'

export const createChainHistoryProvider = (
  url: string
): ChainHistoryProvider => {
  const transactionsByAddresses = async (
    args: TransactionsByAddressesArgs
  ): Promise<Mina.TransactionBody[]> => {
    // need an explorer or other third-party API to fetch transaction history
    console.log('the args are:', args)

    return []
  }

  // TODO: decouple Mina from these providers, maybe `@palladxyz/otpimism-core` ?
  const transactionsByHashes = async (
    args: TransactionsByIdsArgs
  ): Promise<Mina.TransactionBody[]> => {
    const client = createPublicClient({
      chain: optimismSepolia,
      transport: http(url)
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
