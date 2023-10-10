import { Mina } from '@palladxyz/mina-core'
import useSWR from 'swr'

import { useAppStore } from '../store/app'
import { useWalletUi } from './useWalletUi'

export const useTransaction = ({ hash }: { hash: string }) => {
  const { credentialAddress } = useWalletUi()
  const network = useAppStore((state) => state.network)
  return useSWR(
    credentialAddress
      ? [
          'transaction',
          hash,
          Mina.Networks[network.toUpperCase() as keyof typeof Mina.Networks]
        ]
      : null,
    async () => []
  )
}
