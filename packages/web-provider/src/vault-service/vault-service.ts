import { createClient } from "@mina-js/klesia-sdk"
import type { ChainOperationArgs } from "@palladco/key-management"
import type { ProviderConfig } from "@palladco/providers"
import { securePersistence, sessionPersistence } from "@palladco/vault"
import { usePendingTransactionStore } from "@palladco/vault"
import { useVault } from "@palladco/vault"
import dayjs from "dayjs"
import Client from "mina-signer"

import type { SignedTransaction } from "@mina-js/utils"
import type { IVaultService } from "./types"

export enum AuthorizationState {
  ALLOWED = "ALLOWED",
  BLOCKED = "BLOCKED",
}

export const createVaultService = (): IVaultService => {
  const rehydrate = useVault.persist.rehydrate
  const { currentNetworkId } = useVault.getState()
  const network = currentNetworkId === "mina:mainnet" ? "mainnet" : "devnet"
  const networkType =
    currentNetworkId === "mina:mainnet" ? "mainnet" : "testnet"
  const klesia = createClient({ network })
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
  const getTxType = (txData: SignedTransaction["data"]) => {
    if ("feePayer" in txData) {
      return "zkapp"
    }
    if (txData.amount) {
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
      const { currentNetworkId } = useVault.getState()
      const networkType =
        currentNetworkId === "mina:mainnet" ? "mainnet" : "testnet"
      const networkAwareArgs: ChainOperationArgs = {
        ...args,
        networkType,
      }
      return store.sign(signable, networkAwareArgs, getPassphrase)
    },
    submitTransaction: async (sendable) => {
      await rehydrate()
      const { addPendingTransaction } = usePendingTransactionStore.getState()
      const { _syncWallet } = useVault.getState()
      const accounts = await getAccounts()
      const publicKey = accounts?.[0]
      if (!publicKey) throw new Error("Wallet is not initialized.")
      const validTransaction = signer.verifyTransaction(sendable.input as never)
      if (!validTransaction) throw new Error("Invalid transaction.")
      const type = getTxType(sendable.input as never)
      const payload =
        type === "zkapp"
          ? { input: sendable.input }
          : { input: sendable.input, signature: (sendable as any).signature }
      const result = await klesia.request<"mina_sendTransaction">({
        method: "mina_sendTransaction",
        params: [payload as never, type],
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
    storePrivateCredential: async (credential) => {
      await rehydrate()
      const store = useVault.getState()
      store.setObject({
        type: "private-credential",
        credential,
      })
    },
    getPrivateCredential: async (query?) => {
      await rehydrate()
      const store = useVault.getState()
      return await store.searchObjects({
        type: "private-credential",
        ...query,
      })
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
      store.setNetworkInfo(providerConfig.networkId, providerConfig)
      return {
        name: providerConfig.networkName,
        slug: providerConfig.networkId,
        url: providerConfig.archiveNodeEndpoint.url,
      }
    },
    switchNetwork: async (networkId) => {
      await rehydrate()
      const store = useVault.getState()
      const allNetworks = store.allNetworkInfo()
      const nextNetwork = allNetworks.find(
        (network) => network?.networkId === networkId,
      )
      if (!nextNetwork?.networkName) {
        throw new Error(
          `Network Configuration is not defined for the networkId: ${networkId}`,
        )
      }
      await store.switchNetwork(nextNetwork.networkId)
      return {
        slug: networkId,
        name: nextNetwork.networkName,
        url: nextNetwork.nodeEndpoint.url,
      }
    },
    requestNetwork: async () => {
      const { currentNetworkId, networkInfoV2 } = useVault.getState()
      const currentNetwork = networkInfoV2[currentNetworkId]
      if (!currentNetwork) {
        throw new Error(
          `Network Configuration is not defined for the networkId: ${currentNetworkId}`,
        )
      }
      return {
        slug: currentNetworkId,
        name: currentNetwork.networkName,
        url: currentNetwork.nodeEndpoint.url,
      }
    },
    getNetworkId: async () => {
      await rehydrate()
      const store = useVault.getState()
      return store.getNetworkId()
    },
    getNetworkIds: async () => {
      await rehydrate()
      const store = useVault.getState()
      const allNetworks = store.allNetworkInfo().filter((network) => !!network)
      return allNetworks.map((network) => network?.networkId)
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
