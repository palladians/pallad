import { useVault } from '@palladxyz/vault'
import useSWR from 'swr'

import { useAppStore } from '../store/app'

export const useTransaction = ({ hash }: { hash: string }) => {
  const currentWallet = useVault((state) => state.getCurrentWallet())
  const _syncTransactions = useVault((state) => state._syncTransactions)
  const getTransaction = useVault((state) => state.getTransaction)
  const publicKey = currentWallet.credential.credential?.address as string
  const network = useAppStore((state) => state.network)
  const syncAndGetTransaction = async () => {
    await _syncTransactions(network, currentWallet?.credential.credential)
    return getTransaction(network, publicKey, hash, 'MINA') // TODO: remove hardcoded 'MINA'
  }
  return useSWR(
    publicKey ? ['transaction', hash, network] : null,
    async () => await syncAndGetTransaction()
  )
}
