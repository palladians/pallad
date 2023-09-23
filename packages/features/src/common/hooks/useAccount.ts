import { Mina } from '@palladxyz/mina-core'
import useSWR from 'swr'

import { useWallet } from '../../wallet/hooks/useWallet'
import { useAppStore } from '../../wallet/store/app'

export const useAccount = () => {
  const { wallet, address } = useWallet()
  const network = useAppStore((state) => state.network)
  const swr = useSWR(
    address
      ? [
          address,
          'account',
          Mina.Networks[network.toUpperCase() as keyof typeof Mina.Networks]
        ]
      : null,
    async () => await wallet.getAccountInfo()
  )
  const rawMinaBalance = swr.isLoading ? 0 : swr.data?.balance?.total || 0
  const minaBalance =
    rawMinaBalance && BigInt(rawMinaBalance) / BigInt(1_000_000_000)
  return { ...swr, minaBalance }
}
