import { createClient } from "@mina-js/klesia-sdk"
import type { ChainOperationArgs } from "@palladxyz/key-management"
import type { ProviderConfig } from "@palladxyz/providers"
import { securePersistence, sessionPersistence } from "@palladxyz/vault"
import { usePendingTransactionStore } from "@palladxyz/vault"
import { useVault } from "@palladxyz/vault"
import dayjs from "dayjs"
import Client from "mina-signer"

import type { SignedTransaction } from "@mina-js/utils"
import { chainIdToNetwork } from "../utils"
import type { IVaultService } from "./types"

export enum AuthorizationState {
  ALLOWED = "ALLOWED",
  BLOCKED = "BLOCKED",
}

export const createVaultService = (): IVaultService => {
  const rehydrate = useVault.persist.rehydrate
  const { currentNetworkName } = useVault.getState()
  const network = currentNetworkName === "Mainnet" ? "mainnet" : "devnet"
  const networkType = currentNetworkName === "Mainnet" ? "mainnet" : "testnet"
  const client = createClient({ network })
  const signer = new Client({ network: networkType })
  const getAccounts = async () => {
    await rehydrate()
    const store = useVault.getState()
    const credentials = store.credentials
    const addresses = Object.values(credentials).map(
      (cred) => cred?.credential?.address,
    )
    return addresses.filter((address) => address !== undefined) as string[]
  }
  const isLocked = async () => {
    await rehydrate()
    const authenticated =
      ((await securePersistence.getItem("foo")) as unknown) === "bar"
    return !authenticated
  }
  const syncWallet = async () => {
    await rehydrate()
    const store = useVault.getState()
    await store._syncWallet()
  }
  const getTxType = (signedTransaction: SignedTransaction) => {
    if ("feePayer" in signedTransaction.data) {
      return "zkapp"
    }
    if (signedTransaction.data.amount) {
      return "payment"
    }
    return "delegation"
  }
  return {
    getAccounts,
    isLocked,
    sign: async (signable, args, getPassphrase) => {
      await rehydrate()
      const store = useVault.getState()
      const { currentNetworkName } = useVault.getState()
      const networkType =
        currentNetworkName === "Mainnet" ? "mainnet" : "testnet"
      const networkAwareArgs: ChainOperationArgs = {
        ...args,
        networkType,
      }
      return store.sign(signable, networkAwareArgs, getPassphrase)
    },
    submitTransaction: async (payload) => {
      await rehydrate()
      const { addPendingTransaction } = usePendingTransactionStore.getState()
      const { _syncWallet } = useVault.getState()
      const accounts = await getAccounts()
      const publicKey = accounts?.[0]
      if (!publicKey) throw new Error("Wallet is not initialized.")
      const validTransaction = signer.verifyTransaction(payload as never)
      if (!validTransaction) throw new Error("Invalid transaction.")
      const type = getTxType(payload)
      const { result } = await client.request<"mina_sendTransaction">({
        method: "mina_sendTransaction",
        params: [{ input: payload.data, signature: payload.signature }, type],
      })
      addPendingTransaction({
        hash: result,
        expireAt: dayjs().add(8, "hours").toISOString(),
      })
      await _syncWallet()
      return { hash: result }
    },
    getState: async (params, props?) => {
      await rehydrate()
      const store = useVault.getState()
      if (props === undefined) {
        return store.searchObjects(params)
      }
      return store.searchObjects(params, props)
    },
    setState: async (state) => {
      await rehydrate()
      const store = useVault.getState()
      store.setObject(state)
    },
    getEnabled: async ({ origin }) => {
      const { permissions } = await chrome.storage.local.get({
        permissions: true,
      })
      return permissions[origin] === AuthorizationState.ALLOWED
    },
    isBlocked: async ({ origin }) => {
      const { permissions } = await chrome.storage.local.get({
        permissions: true,
      })
      return permissions[origin] === AuthorizationState.BLOCKED
    },
    setEnabled: async ({ origin }) => {
      const { permissions } = await chrome.storage.local.get({
        permissions: true,
      })
      return chrome.storage.local.set({
        permissions: {
          ...permissions,
          [origin]: AuthorizationState.ALLOWED,
        },
      })
    },
    getBalance: async () => {
      await rehydrate()
      const store = useVault.getState()
      return Number(
        (store.getCurrentWallet().accountInfo.MINA?.balance.total ?? 0) / 1e9,
      ) as number
    },
    addChain: async (providerConfig: ProviderConfig) => {
      await rehydrate()
      const store = useVault.getState()
      store.setNetworkInfo(providerConfig.networkName, providerConfig)
      return {
        networkName: providerConfig.networkName,
        chainId: providerConfig.chainId,
      }
    },
    switchChain: async (chainId) => {
      await rehydrate()
      const store = useVault.getState()
      // check if chainId is in the store
      const allChains = store.getChainIds()
      if (allChains.includes(chainId)) {
        // get the networkName if the chainId exists
        const allNetworks = store.allNetworkInfo()
        const networkConfig = allNetworks.find(
          (network) => network?.chainId === chainId,
        )
        if (!networkConfig || !networkConfig.networkName) {
          throw new Error(
            `Network Configuration is not defined for the chainId: ${chainId}`,
          )
        }
        await store.switchNetwork(networkConfig?.networkName)
        return { chainId, networkName: networkConfig?.networkName }
      }
      throw new Error(
        "chainId does not exist in the store, please use `addChain` first.",
      )
    },
    requestNetwork: async () => {
      await rehydrate()
      const store = useVault.getState()
      // check if chainId is in the store
      const chainId = store.getChainId()
      if (chainId !== "...") {
        // get the networkName if the chainId exists
        const allNetworks = store.allNetworkInfo()
        const networkConfig = allNetworks.find(
          (network) => network?.chainId === chainId,
        )
        if (!networkConfig || !networkConfig.networkName) {
          throw new Error(
            `Network Configuration is not defined for the chainId: ${chainId}`,
          )
        }
        return { chainId: chainId, networkName: networkConfig?.networkName }
      }
      throw new Error("Something went wrong!")
    },
    getChainId: async () => {
      await rehydrate()
      const store = useVault.getState()
      return store.getChainId()
    },
    getChainIds: async () => {
      await rehydrate()
      const store = useVault.getState()
      return store.getChainIds()
    },
    // TODO: deprecate this method
    switchNetwork: async (network) => {
      await rehydrate()
      const store = useVault.getState()
      // map chainId to network
      const networkName = chainIdToNetwork(network)
      if (!networkName) {
        throw new Error(`Invalid chain id: ${network}`)
      }
      return store.switchNetwork(networkName)
    },
    unlockWallet: async (spendingPassword: string) => {
      await sessionPersistence.setItem("spendingPassword", spendingPassword)
      await rehydrate()
      const locked = await isLocked()
      if (locked === true) {
        console.error("incorrect password.")
      } else {
        await syncWallet()
      }
    },
  }
}
