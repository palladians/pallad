import type {
  ChainSignablePayload,
  GetPassphrase,
} from "@palladxyz/key-management"
import type { ChainOperationArgs } from "@palladxyz/key-management"
import type { ProviderConfig } from "@palladxyz/providers"
import { securePersistence, sessionPersistence } from "@palladxyz/vault"
import { usePendingTransactionStore } from "@palladxyz/vault"
import {
  type SearchQuery,
  type SingleObjectState,
  useVault,
} from "@palladxyz/vault"
import dayjs from "dayjs"
import Client from "mina-signer"

import type { Mina } from "@palladxyz/mina-core"
import type { Validation } from ".."
import { chainIdToNetwork } from "../utils"
import type { IVaultService } from "./types"

export enum AuthorizationState {
  ALLOWED = "ALLOWED",
  BLOCKED = "BLOCKED",
}

export type ZkAppUrl = string

export class VaultService implements IVaultService {
  private static instance: VaultService

  private constructor() {}

  public static getInstance() {
    if (!VaultService.instance) {
      VaultService.instance = new VaultService()
    }
    return VaultService.instance
  }

  async getAccounts() {
    await this.rehydrate()
    // TODO: handle errors
    const store = useVault.getState()
    const credentials = store.credentials
    const addresses = Object.values(credentials).map(
      (cred) => cred?.credential?.address,
    )
    return addresses.filter((address) => address !== undefined) as string[]
  }

  async sign(
    signable: ChainSignablePayload,
    args: ChainOperationArgs,
    getPassphrase: GetPassphrase,
  ) {
    await this.rehydrate()
    const store = useVault.getState()
    const { currentNetworkName } = useVault.getState()
    const networkType = currentNetworkName === "Mainnet" ? "mainnet" : "testnet"
    const networkAwareArgs: ChainOperationArgs = {
      ...args,
      networkType,
    }
    return store.sign(signable, networkAwareArgs, getPassphrase)
  }

  async submitTransaction(payload: Validation.SendTransactionData) {
    await this.rehydrate()
    const { addPendingTransaction } = usePendingTransactionStore.getState()
    const { currentNetworkName, submitTx, _syncWallet } = useVault.getState()
    const network = currentNetworkName === "Mainnet" ? "mainnet" : "testnet"
    const accounts = await this.getAccounts()
    const publicKey = accounts?.[0]
    if (!publicKey) throw new Error("Wallet is not initialized.")
    if (publicKey !== payload.signedTransaction.data.from)
      throw new Error("Wallet is not initialized.")
    const client = new Client({ network })
    const validTransaction = client.verifyTransaction(
      payload.signedTransaction as Mina.SignedTransaction,
    )
    if (!validTransaction) throw new Error("Invalid transaction.")
    const submittable = {
      signedTransaction: payload.signedTransaction,
      type: payload.transactionType,
      transactionDetails: payload.signedTransaction.data,
    }
    const submittedTx: any = await submitTx(submittable as any)
    const hash =
      submittedTx?.sendPayment?.payment?.hash ??
      submittedTx?.sendDelegation?.delegation?.hash
    addPendingTransaction({
      hash,
      expireAt: dayjs().add(8, "hours").toISOString(),
    })
    await _syncWallet()
    return { hash }
  }

  async getState(params: SearchQuery, props?: string[]) {
    await this.rehydrate()
    const store = useVault.getState()
    /*
    // the searchObjects method operates with
    // storedObjects = result.current.searchObjects(searchQuery, props)
    // the search query can contain expected properties of the object
    // and the optional props is the required output field
    // for example:

      const searchQuery = {
        type: 'KYCCredential',
        chain: Network.Mina
      }
      // return props
      const props = ['proof']
    // this will return the KYC credential's `proof` field and nothing else
    */
    // TODO: we can also implement getObjects instead of searchObjs if necessary
    if (props === undefined) {
      return store.searchObjects(params)
    }
    return store.searchObjects(params, props)
  }

  async setState(state: SingleObjectState) {
    await this.rehydrate()
    const store = useVault.getState()
    // add the given object to the store
    store.setObject(state)
  }

  async getEnabled({ origin }: { origin: ZkAppUrl }) {
    const { permissions } = await chrome.storage.local.get({
      permissions: true,
    })
    return permissions[origin] === AuthorizationState.ALLOWED
  }

  async isBlocked({ origin }: { origin: ZkAppUrl }) {
    const { permissions } = await chrome.storage.local.get({
      permissions: true,
    })
    return permissions[origin] === AuthorizationState.BLOCKED
  }

  async setEnabled({ origin }: { origin: ZkAppUrl }) {
    const { permissions } = await chrome.storage.local.get({
      permissions: true,
    })
    return chrome.storage.local.set({
      permissions: {
        ...permissions,
        [origin]: AuthorizationState.ALLOWED,
      },
    })
  }

  async getBalance() {
    await this.rehydrate()
    const store = useVault.getState()
    return Number(
      // TODO: this doesn't have to be 'MINA'
      (store.getCurrentWallet().accountInfo.MINA?.balance.total ?? 0) / 1e9,
    ) as number
  }

  async addChain(providerConfig: ProviderConfig) {
    await this.rehydrate()
    const store = useVault.getState()
    store.setNetworkInfo(providerConfig.networkName, providerConfig)
    return {
      networkName: providerConfig.networkName,
      chainId: providerConfig.chainId,
    }
  }

  async switchChain(chainId: string) {
    await this.rehydrate()
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
      return { chainId: chainId, networkName: networkConfig?.networkName }
    }
    throw new Error(
      "chainId does not exist in the store, please use `addChain` first.",
    )
  }

  async requestNetwork() {
    await this.rehydrate()
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
  }

  async getChainId() {
    await this.rehydrate()
    const store = useVault.getState()
    return store.getChainId()
  }

  async getChainIds() {
    await this.rehydrate()
    const store = useVault.getState()
    return store.getChainIds()
  }
  // TODO: deprecate this method
  async switchNetwork(network: string) {
    await this.rehydrate()
    const store = useVault.getState()
    // map chainId to network
    const networkName = chainIdToNetwork(network)
    if (!networkName) {
      throw new Error(`Invalid chain id: ${network}`)
    }
    return store.switchNetwork(networkName)
  }

  async isLocked() {
    await this.rehydrate()
    const authenticated =
      ((await securePersistence.getItem("foo")) as unknown) === "bar"
    return !authenticated
  }

  async unlockWallet(spendingPassword: string) {
    await sessionPersistence.setItem("spendingPassword", spendingPassword)
    await this.rehydrate()
    const locked = await this.isLocked()
    if (locked === true) {
      console.error("incorrect password.")
    } else {
      await this.syncWallet()
    }
  }

  async rehydrate() {
    return useVault.persist.rehydrate()
  }

  async syncWallet() {
    await this.rehydrate()
    const store = useVault.getState()
    await store._syncWallet()
  }
}

export const vaultService = VaultService.getInstance()
