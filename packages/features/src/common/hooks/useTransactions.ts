import { Mina } from '@palladxyz/mina-core'
import { useVault } from '@palladxyz/vault'
import useSWR from 'swr'

import { useAppStore } from '../store/app'

export const useTransactions = () => {
  const currentWallet = useVault((state) => state.getCurrentWallet())
  const getTransactions = useVault((state) => state.getTransactions)
  const { publicKey } = currentWallet.accountInfo
  const network = useAppStore((state) => state.network)
  return useSWR(
    publicKey
      ? [
          publicKey,
          'transactions',
          Mina.Networks[network.toUpperCase() as keyof typeof Mina.Networks]
        ]
      : null,
    () => getTransactions(network, publicKey)
  )
}
