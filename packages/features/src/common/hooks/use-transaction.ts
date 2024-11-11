import { getPublicKey, useVault } from "@palladco/vault"
import useSWR from "swr"

export const useTransaction = ({ hash }: { hash: string }) => {
  const providerConfig = useVault((state) => state.getCurrentNetworkInfo())
  const currentWallet = useVault((state) => state.getCurrentWallet())
  const _syncTransactions = useVault((state) => state._syncTransactions)
  const getTransaction = useVault((state) => state.getTransaction)
  const publicKey = getPublicKey(currentWallet)
  const networkId = useVault((state) => state.currentNetworkId)
  const syncAndGetTransaction = async () => {
    if (!providerConfig) return
    await _syncTransactions(providerConfig, publicKey)
    return getTransaction(networkId, publicKey, hash, "MINA") // TODO: remove hardcoded 'MINA'
  }
  return useSWR(
    publicKey ? ["transaction", hash, networkId] : null,
    async () => await syncAndGetTransaction(),
  )
}
