import { Network, getAccountProperties } from "@palladxyz/pallad-core"
import { getSessionPersistence } from "@palladxyz/persistence"
import { getPublicKey, isDelegated, useVault } from "@palladxyz/vault"
import easyMeshGradient from "easy-mesh-gradient"
import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import useSWR from "swr"
import { useAppStore } from "../store/app"

export const useAccount = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const currentWallet = useVault((state) => state.getCurrentWallet())
  const getAccountsInfo = useVault((state) => state.getAccountsInfo)
  const restartWallet = useVault((state) => state.restartWallet)
  const _syncWallet = useVault((state) => state._syncWallet)
  const network = useAppStore((state) => state.network)
  const setVaultStateUninitialized = useAppStore(
    (state) => state.setVaultStateUninitialized,
  )
  const fetchWallet = async () => {
    await _syncWallet()
    const accountInfo = getAccountsInfo(network, publicKey)
    const chain = currentWallet.credential.credential.chain
    const props = getAccountProperties(accountInfo.accountInfo, chain)
    return props
  }
  const publicKey = getPublicKey(currentWallet)
  const swr = useSWR(
    publicKey ? [publicKey, "account", network] : null,
    async () => await fetchWallet(),
    {
      refreshInterval: 30000,
    },
  )
  const rawBalance = swr.isLoading ? 0 : swr.data.balance ?? 0
  let minaBalance: bigint | number | 0
  if (currentWallet.credential.credential.chain === Network.Mina) {
    minaBalance = rawBalance && BigInt(rawBalance) / BigInt(1_000_000_000) // TODO: adjust this for other chains and their decimal conversion
  } else if (currentWallet.credential.credential.chain === Network.Ethereum) {
    minaBalance = rawBalance
  } else {
    throw new Error("chain is not supported in useAccount")
  }
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
    toast({
      title: "Wallet address was copied.",
    })
  }
  const lockWallet = async () => {
    await getSessionPersistence().setItem("spendingPassword", "")
    await useVault.persist.rehydrate()
    return navigate("/unlock")
  }
  const restartCurrentWallet = () => {
    restartWallet()
    setVaultStateUninitialized()
    return navigate("/")
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
    stakeDelegated,
  }
}
