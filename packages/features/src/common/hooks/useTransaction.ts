import { MinaNetwork } from '@palladxyz/key-management'
import useSWR from 'swr'

import { useWallet } from '../../wallet/hooks/useWallet'
import { useAppStore } from '../../wallet/store/app'

export const useTransaction = ({ hash }: { hash: string }) => {
  const { wallet } = useWallet()
  const address = wallet.getCurrentWallet()?.address
  const network = useAppStore((state) => state.network)
  return useSWR(
    address ? ['transaction', hash, MinaNetwork[network]] : null,
    async () => await wallet.getTransaction({ hash })
  )
}
