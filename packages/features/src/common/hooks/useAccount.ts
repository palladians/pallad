import { Mina } from '@palladxyz/mina-core'
import { useVault } from '@palladxyz/vault'
import useSWR from 'swr'

import { useAppStore } from '../store/app'

export const useAccount = () => {
  const currentWallet = useVault((state) => state.getCurrentWallet())
  const getAccountInfo = useVault((state) => state.getAccountInfo)
  const network = useAppStore((state) => state.network)
  const { publicKey } = currentWallet.accountInfo
  const swr = useSWR(
    publicKey
      ? [
          publicKey,
          'account',
          Mina.Networks[network.toUpperCase() as keyof typeof Mina.Networks]
        ]
      : null,
    async () => await getAccountInfo(network, publicKey)
  )
  const rawMinaBalance = swr.isLoading
    ? 0
    : swr.data?.accountInfo.balance.total || 0
  const minaBalance =
    rawMinaBalance && BigInt(rawMinaBalance) / BigInt(1_000_000_000)
  return { ...swr, minaBalance }
}
