import { getPublicKey, useVault } from "@palladxyz/vault"
import useSWR from "swr"

export const useTransactions = () => {
  const currentWallet = useVault((state) => state.getCurrentWallet())
  const getTransactions = useVault((state) => state.getTransactions)
  const publicKey = getPublicKey(currentWallet)
  const currentNetworkName = useVault((state) => state.currentNetworkName)
  return useSWR(
    publicKey ? [publicKey, "transactions", currentNetworkName] : null,
    () => getTransactions(currentNetworkName, publicKey, "MINA"), // TODO: remove hardcoded 'MINA'
  )
}
