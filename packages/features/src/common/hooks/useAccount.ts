import { Mina } from '@palladxyz/mina-core'
import useSWR from 'swr'

import { useAppStore } from '../store/app'
import { useWalletUi } from './useWalletUi'

export const useAccount = () => {
  const { credentialAddress, getWalletAccountInfo } = useWalletUi()
  const network = useAppStore((state) => state.network)
  const swr = useSWR(
    credentialAddress
      ? [
          credentialAddress,
          'account',
          Mina.Networks[network.toUpperCase() as keyof typeof Mina.Networks]
        ]
      : null,
    async () => await getWalletAccountInfo()
  )
  const rawMinaBalance = swr.isLoading ? 0 : swr.data?.balance?.total || 0
  const minaBalance =
    rawMinaBalance && BigInt(rawMinaBalance) / BigInt(1_000_000_000)
  return { ...swr, minaBalance }
}
