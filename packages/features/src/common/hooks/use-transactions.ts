import { useVault } from '@palladxyz/vault'
import useSWR from 'swr'

import { useAppStore } from '../store/app'

export const useTransactions = () => {
  const currentWallet = useVault((state) => state.getCurrentWallet())
  const getTransactions = useVault((state) => state.getTransactions)
  const publicKey = currentWallet.credential.credential?.address as string
  const network = useAppStore((state) => state.network)
  return useSWR(
    publicKey ? [publicKey, 'transactions', network] : null,
    () => getTransactions(network, publicKey, 'MINA') // TODO: remove hardcoded 'MINA'
  )
}
