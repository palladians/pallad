import { Mina } from '@palladxyz/mina-core'
import useSWR from 'swr'

import { useWallet } from '../../wallet/hooks/useWallet'
import { useAppStore } from '../../wallet/store/app'

export const useTransactions = () => {
  const { wallet, address } = useWallet()
  const network = useAppStore((state) => state.network)
  return useSWR(
    address
      ? [
          address,
          'transactions',
          Mina.Networks[network.toUpperCase() as keyof typeof Mina.Networks]
        ]
      : null,
    async () => await wallet.getTransactions()
  )
}
