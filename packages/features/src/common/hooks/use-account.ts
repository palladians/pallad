import { Mina } from '@palladxyz/mina-core'
import { getSessionPersistence } from '@palladxyz/persistence'
import { useVault } from '@palladxyz/vault'
import easyMeshGradient from 'easy-mesh-gradient'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import useSWR from 'swr'

import { useToast } from '@/components/ui/use-toast'

import { useAppStore } from '../store/app'

export const useAccount = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const currentWallet = useVault((state) => state.getCurrentWallet())
  const getAccountInfo = useVault((state) => state.getAccountInfo)
  const restartWallet = useVault((state) => state.restartWallet)
  const _syncWallet = useVault((state) => state._syncWallet)
  const network = useAppStore((state) => state.network)
  const setVaultStateUninitialized = useAppStore(
    (state) => state.setVaultStateUninitialized
  )
  const fetchWallet = async () => {
    await _syncWallet(network, currentWallet?.credential.credential)
    return getAccountInfo(network, publicKey)
  }
  const { publicKey } = currentWallet.accountInfo
  const swr = useSWR(
    publicKey
      ? [
          publicKey,
          'account',
          Mina.Networks[network.toUpperCase() as keyof typeof Mina.Networks]
        ]
      : null,
    async () => await fetchWallet(),
    {
      refreshInterval: 30000
    }
  )
  const rawMinaBalance = swr.isLoading
    ? 0
    : swr.data?.accountInfo?.balance?.total ?? 0
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
  const stakeDelegated =
    currentWallet.accountInfo.publicKey !== currentWallet.accountInfo.delegate
  const copyWalletAddress = async () => {
    await navigator.clipboard.writeText(publicKey ?? '')
    toast({
      title: 'Wallet address was copied.'
    })
  }
  const lockWallet = async () => {
    await getSessionPersistence().setItem('spendingPassword', '')
    await useVault.persist.rehydrate()
    return navigate('/unlock')
  }
  const restartCurrentWallet = () => {
    restartWallet()
    setVaultStateUninitialized()
    return navigate('/')
  }
  return {
    ...swr,
    minaBalance,
    gradientBackground,
    copyWalletAddress,
    accountInfo: currentWallet.accountInfo,
    publicKey,
    lockWallet,
    restartCurrentWallet,
    network,
    stakeDelegated
  }
}
