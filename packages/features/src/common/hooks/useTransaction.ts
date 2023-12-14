import { Mina } from '@palladxyz/mina-core'
import { useVault } from '@palladxyz/vault'
import useSWR from 'swr'

import { useAppStore } from '../store/app'

export const useTransaction = ({ hash }: { hash: string }) => {
  const currentWallet = useVault((state) => state.getCurrentWallet())
  const _syncTransactions = useVault((state) => state._syncTransactions)
  const getTransaction = useVault((state) => state.getTransaction)
  const { publicKey } = currentWallet.accountInfo
  const network = useAppStore((state) => state.network)
  const syncAndGetTransaction = async () => {
    await _syncTransactions(network, currentWallet?.credential.credential)
    return getTransaction(network, publicKey, hash)
  }
  return useSWR(
    publicKey
      ? [
          'transaction',
          hash,
          Mina.Networks[network.toUpperCase() as keyof typeof Mina.Networks]
        ]
      : null,
    async () => await syncAndGetTransaction()
  )
}
