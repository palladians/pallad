import { Mina } from '@palladxyz/mina-core'
import { useVault } from '@palladxyz/vault'
import useSWR from 'swr'

import { useAppStore } from '../store/app'

export const useTransaction = ({ hash }: { hash: string }) => {
  const currentWallet = useVault((state) => state.getCurrentWallet())
  const { publicKey } = currentWallet.accountInfo
  const network = useAppStore((state) => state.network)
  return useSWR(
    publicKey
      ? [
          'transaction',
          hash,
          Mina.Networks[network.toUpperCase() as keyof typeof Mina.Networks]
        ]
      : null,
    async () => []
  )
}
