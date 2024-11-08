import type { Tx } from "@palladco/pallad-core"
import { type ProviderConfig, createChainProvider } from "@palladco/providers"

export async function syncTransactionHelper(
  get: any,
  providerConfig: ProviderConfig,
  publicKey: string,
) {
  const { setTransactions } = get()
  // TODO: add condition where archive node is unavailable then transactions
  // are simply []
  const provider = createChainProvider(providerConfig)
  const transactions = (await provider.getTransactions({
    addresses: [publicKey],
  })) as Tx[]
  const transactionsRecord = {
    // TODO: remove 'MINA' as the key
    MINA: transactions,
  } // TODO: replace with util using tokeId map to map transactions to tokens
  setTransactions(providerConfig.networkId, publicKey, transactionsRecord) // note: there is no pagination now
}
