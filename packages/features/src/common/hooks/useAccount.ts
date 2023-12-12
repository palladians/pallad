import { Mina } from '@palladxyz/mina-core'
import { useVault } from '@palladxyz/vault'
import useSWR from 'swr'

import { useAppStore } from '../store/app'
import easyMeshGradient from 'easy-mesh-gradient'
import { useMemo } from 'react'

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
  const gradientBackground = useMemo(
    () =>
      publicKey &&
      easyMeshGradient({
        seed: publicKey,
        hueRange: [180, 240]
      }),
    [publicKey]
  )
  return { ...swr, minaBalance, gradientBackground }
}
