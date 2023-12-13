import { Mina } from '@palladxyz/mina-core'
import { getSessionPersistence } from '@palladxyz/persistence'
import { useToast } from '@palladxyz/ui'
import { useVault } from '@palladxyz/vault'
import easyMeshGradient from 'easy-mesh-gradient'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'

import { useAppStore } from '../store/app'

export const useAccount = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
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
  const copyWalletAddress = async () => {
    await navigator.clipboard.writeText(publicKey || '')
    toast({
      title: 'Wallet address was copied.'
    })
  }
  const lockWallet = async () => {
    await getSessionPersistence().setItem('spendingPassword', '')
    await useVault.persist.rehydrate()
    return navigate('/unlock')
  }
  return {
    ...swr,
    minaBalance,
    gradientBackground,
    copyWalletAddress,
    publicKey,
    lockWallet
  }
}
