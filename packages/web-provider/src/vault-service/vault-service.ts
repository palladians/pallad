import { createClient } from "@mina-js/klesia-sdk"
import type { ChainOperationArgs } from "@palladco/key-management"
import type { ProviderConfig } from "@palladco/providers"
import { securePersistence, sessionPersistence } from "@palladco/vault"
import { usePendingTransactionStore } from "@palladco/vault"
import { useVault } from "@palladco/vault"
import dayjs from "dayjs"
import Client from "mina-signer"

import { type SignedTransaction, toMinaSignerFormat } from "@mina-js/utils"
import type {
  SignableData,
  Signed,
  SignedLegacy,
  ZkappCommand,
} from "mina-signer/dist/node/mina-signer/src/types"
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
    const addresses = Object.values(credentials)
      .sort((a, b) => (b.lastSelected ?? 0) - (a.lastSelected ?? 0))
      .map((cred) => cred?.credential?.address)
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
      const type = getTxType(sendable.input)
      const verifyTransactionParams =
        "signature" in sendable
          ? ({
              signature: sendable.signature,
              publicKey: sendable.input.from,
              data: sendable.input,
            } as SignedLegacy<SignableData>)
          : ({
              signature: sendable.input.zkappCommand.feePayer.authorization,
              publicKey: sendable.input.zkappCommand.feePayer.body.publicKey,
              data: toMinaSignerFormat(sendable.input),
            } as Signed<ZkappCommand>)
      if (!signer.verifyTransaction(verifyTransactionParams))
        throw new Error("Invalid transaction.")
      const payload =
        "signature" in sendable
          ? {
              input: sendable.input,
              signature: sendable.signature,
            }
          : { input: sendable.input }
      const result = await klesia.request<"mina_sendTransaction">({
        method: "mina_sendTransaction",
        params: [payload, type],
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
      return store.searchObjects({ query: params, props })
    },
    setState: async ({ credentialId, credential }) => {
      await rehydrate()
      const store = useVault.getState()
      store.setObject({ credentialId, credential })
    },
    storePrivateCredential: async (credential) => {
      await rehydrate()
      const store = useVault.getState()
      return store.setObject({
        credentialId: crypto.randomUUID(),
        credential: {
          ...(credential as object),
          type: "private-credential",
        },
      })
    },
    getPrivateCredential: async () => {
      await rehydrate()
      const store = useVault.getState()
      const credentials = await store.searchObjects({
        query: { type: "private-credential" },
        props: [],
      })

      // Remove the type field from each credential in the results
      return credentials.map((credential) => {
        if (!credential) return credential
        const { type, ...credentialWithoutType } = credential as any
        return credentialWithoutType
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
      return store.getCurrentWallet().accountInfo.MINA?.balance.total ?? 0
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
      const { currentNetworkId, networkInfoV3 } = useVault.getState()
      const currentNetwork = networkInfoV3[currentNetworkId]
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
