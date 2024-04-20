import {
  ChainHistoryProvider,
  TransactionsByAddressesArgs,
  TransactionsByHashesArgs,
  Tx
} from '@palladxyz/pallad-core'

/*import {
  createPublicClient,
  GetTransactionParameters,
  Hash,
  webSocket
} from 'viem'*/
import { healthCheckOptimism } from '../utils'

export const createChainHistoryProvider = (
  url: string,
  apiKey = ''
): ChainHistoryProvider => {
  const transactionsByAddresses = async (
    args: TransactionsByAddressesArgs
  ): Promise<Tx[]> => {
    const { addresses } = args
    const page = 1
    const offset = 20
    const sort = 'asc'
    const baseEtherscanUrl = `${url}api?module=account&action=txlistinternal&apikey=${apiKey}`

    // Fetch transactions for each address (handle only the first address for simplification here)
    if (addresses.length === 0) {
      return []
    }
    const address = addresses[0] // Simplification: only process the first address
    const fullUrl = `${baseEtherscanUrl}&address=${address}&page=${page}&offset=${offset}&sort=${sort}`

    const response = await fetch(fullUrl)
    const data = await response.json()

    if (data.status !== '1') {
      throw new Error(`Failed to fetch transactions: ${data.message}`)
    }

    // Map Etherscan response to Tx[]
    return data.result
  }

  const transactionsByHashes = async (
    args: TransactionsByHashesArgs
  ): Promise<Tx[]> => {
    // TODO: make dependency on etherscan
    /*const client = createPublicClient({
      chain: args.chainInfo,
      transport: webSocket(url)
    })
    const transactionArgs: GetTransactionParameters = {
      hash: args.ids[0] as Hash
    }
    const transactions = await client.getTransaction(transactionArgs)

    return transactions as any*/
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log('args', args)
    return [] as Tx[]
  }

  return {
    healthCheck: () => healthCheckOptimism(url),
    transactionsByAddresses,
    transactionsByHashes
  }
}
