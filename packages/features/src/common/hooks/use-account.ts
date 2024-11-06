import { Network, getAccountProperties } from "@palladxyz/pallad-core"
import { sessionPersistence } from "@palladxyz/vault"
import { getPublicKey, isDelegated, useVault } from "@palladxyz/vault"
import easyMeshGradient from "easy-mesh-gradient"
import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import useSWR from "swr"
import { useAppStore } from "../store/app"

export const useAccount = () => {
  const navigate = useNavigate()
  const currentWallet = useVault((state) => state.getCurrentWallet())
  const currentNetworkId = useVault((state) => state.currentNetworkId)
  const getAccountsInfo = useVault((state) => state.getAccountsInfo)
  const restartWallet = useVault((state) => state.restartWallet)
  const _syncWallet = useVault((state) => state._syncWallet)
  const setVaultStateUninitialized = useAppStore(
    (state) => state.setVaultStateUninitialized,
  )
  const fetchWallet = async () => {
    await _syncWallet()
    const accountInfo = getAccountsInfo(currentNetworkId, publicKey)
    const chain = currentWallet.credential.credential?.chain
    const props = getAccountProperties(
      accountInfo.accountInfo,
      chain ?? Network.Mina,
    )
    return props
  }
  const publicKey = getPublicKey(currentWallet)
  const swr = useSWR(
    publicKey ? [publicKey, "account", currentNetworkId] : null,
    async () => await fetchWallet(),
    {
      refreshInterval: 30000,
    },
  )
  const rawBalance = swr.isLoading ? 0 : swr.data?.balance ?? 0
  const minaBalance =
    rawBalance && Number.parseInt(String(rawBalance)) / 1_000_000_000
  const gradientBackground = useMemo(
    () =>
      publicKey &&
      easyMeshGradient({
        seed: publicKey,
        hueRange: [180, 240],
      }),
    [publicKey],
  )
  const stakeDelegated = isDelegated(currentWallet)
  const copyWalletAddress = async () => {
    await navigator.clipboard.writeText(publicKey ?? "")
    toast.success("Address copied")
  }
  const lockWallet = async () => {
    await sessionPersistence.setItem("spendingPassword", "")
    navigate("/unlock")
    await useVault.persist.rehydrate()
  }
  const restartCurrentWallet = () => {
    restartWallet()
    setVaultStateUninitialized()
    return navigate("/")
  }
  return {
    ...swr,
    fetchWallet,
    minaBalance,
    gradientBackground,
    copyWalletAddress,
    currentWallet,
    publicKey,
    lockWallet,
    restartCurrentWallet,
    networkId: currentNetworkId,
    stakeDelegated,
  }
}
