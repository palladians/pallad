import type { Mina } from "@palladco/mina-core"
import { getPublicKey, useVault } from "@palladco/vault"
import useSWR from "swr"

export const useTransactions = () => {
  const currentWallet = useVault((state) => state.getCurrentWallet())
  const getTransactions = useVault((state) => state.getTransactions)
  const publicKey = getPublicKey(currentWallet)
  const networkId = useVault((state) => state.currentNetworkId)
  return useSWR(
    publicKey ? [publicKey, "transactions", networkId] : null,
    () =>
      getTransactions(networkId, publicKey, "MINA") as Mina.TransactionBody[], // TODO: remove hardcoded 'MINA'
  )
}
