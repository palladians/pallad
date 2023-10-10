import { Mina } from '@palladxyz/mina-core'
import useSWR from 'swr'

import { useAppStore } from '../store/app'
import { useWalletUi } from './useWalletUi'

export const useTransactions = () => {
  const { credentialAddress, getWalletTransactions } = useWalletUi()
  const network = useAppStore((state) => state.network)
  return useSWR(
    credentialAddress
      ? [
          credentialAddress,
          'transactions',
          Mina.Networks[network.toUpperCase() as keyof typeof Mina.Networks]
        ]
      : null,
    async () => await getWalletTransactions()
  )
}
