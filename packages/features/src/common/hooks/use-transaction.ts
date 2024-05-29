import { getPublicKey, useVault } from "@palladxyz/vault"
import useSWR from "swr"

export const useTransaction = ({ hash }: { hash: string }) => {
  const providerConfig = useVault((state) => state.getCurrentNetworkInfo())
  const currentWallet = useVault((state) => state.getCurrentWallet())
  const _syncTransactions = useVault((state) => state._syncTransactions)
  const getTransaction = useVault((state) => state.getTransaction)
  const publicKey = getPublicKey(currentWallet)
  const currentNetworkName = useVault((state) => state.currentNetworkName)
  const syncAndGetTransaction = async () => {
    await _syncTransactions(providerConfig, publicKey)
    return getTransaction(currentNetworkName, publicKey, hash, "MINA") // TODO: remove hardcoded 'MINA'
  }
  return useSWR(
    publicKey ? ["transaction", hash, currentNetworkName] : null,
    async () => await syncAndGetTransaction(),
  )
}
