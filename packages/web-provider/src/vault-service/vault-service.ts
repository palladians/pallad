import { ChainSignablePayload, GetPassphrase } from '@palladxyz/key-management'
import { ChainOperationArgs } from '@palladxyz/key-management'
import {
  getSecurePersistence,
  getSessionPersistence
} from '@palladxyz/persistence'
import { ProviderConfig } from '@palladxyz/providers'
import { SearchQuery, SingleObjectState, useVault } from '@palladxyz/vault'

import { chainIdToNetwork } from '../utils'
import { IVaultService } from './types'

export enum AuthorizationState {
  ALLOWED = 'ALLOWED',
  BLOCKED = 'BLOCKED'
}

export type ZkAppUrl = string

export class VaultService implements IVaultService {
  private static instance: VaultService

  private constructor(exampleArg?: boolean) {
    console.log('exampleArg: ', exampleArg)
  }

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
      (cred) => cred?.credential?.address
    )
    return addresses.filter((address) => address !== undefined) as string[]
  }

  async sign(
    signable: ChainSignablePayload,
    args: ChainOperationArgs,
    getPassphrase: GetPassphrase
  ) {
    await this.rehydrate()
    const store = useVault.getState()
    return store.sign(signable, args, getPassphrase)
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
    } else {
      return store.searchObjects(params, props)
    }
  }

  async setState(state: SingleObjectState) {
    await this.rehydrate()
    const store = useVault.getState()
    // add the given object to the store
    store.setObject(state)
  }

  async getEnabled({ origin }: { origin: ZkAppUrl }) {
    await this.rehydrate()
    const store = useVault.getState()
    // FIXME
    return store.authorized[origin] === AuthorizationState.ALLOWED
  }

  async isBlocked({ origin }: { origin: ZkAppUrl }) {
    await this.rehydrate()
    const store = useVault.getState()

    return store.authorized[origin] === AuthorizationState.BLOCKED
  }

  async setEnabled({ origin }: { origin: ZkAppUrl }) {
    await this.rehydrate()
    const store = useVault.getState()
    store.mutateZkAppPermission({
      origin,
      authorizationState: AuthorizationState.ALLOWED
    })
  }

  async getBalance() {
    await this.rehydrate()
    const store = useVault.getState()
    return Number(
      // TODO: this doesn't have to be 'MINA'
      store.getCurrentWallet().accountInfo['MINA']!.balance.total / 1e9
    ) as number
  }

  async addChain(providerConfig: ProviderConfig) {
    await this.rehydrate()
    const store = useVault.getState()
    store.setNetworkInfo(providerConfig.networkName, providerConfig)
    return {
      networkName: providerConfig.networkName,
      chainId: providerConfig.chainId
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
        (network) => network!.chainId === chainId
      )
      if (!networkConfig || !networkConfig.networkName) {
        throw new Error(
          `Network Configuration is not defined for the chainId: ${chainId}`
        )
      }
      await store.switchNetwork(networkConfig!.networkName)
      return { chainId: chainId, networkName: networkConfig!.networkName }
    } else {
      throw new Error(
        'chainId does not exist in the store, please use `addChain` first.'
      )
    }
  }

  async requestNetwork() {
    await this.rehydrate()
    const store = useVault.getState()
    // check if chainId is in the store
    const chainId = store.getChainId()
    if (chainId !== '...') {
      // get the networkName if the chainId exists
      const allNetworks = store.allNetworkInfo()
      const networkConfig = allNetworks.find(
        (network) => network!.chainId === chainId
      )
      if (!networkConfig || !networkConfig.networkName) {
        throw new Error(
          `Network Configuration is not defined for the chainId: ${chainId}`
        )
      }
      return { chainId: chainId, networkName: networkConfig!.networkName }
    } else {
      throw new Error('Something went wrong!')
    }
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
      (await getSecurePersistence().getItem('foo')) === 'bar'
    return !authenticated
  }

  async unlockWallet(spendingPassword: string) {
    await getSessionPersistence().setItem('spendingPassword', spendingPassword)
    await this.rehydrate()
    const locked = await this.isLocked()
    if (locked === true) {
      console.error('incorrect password.')
    } else {
      await this.syncWallet()
    }
  }

  async rehydrate() {
    return await useVault.persist.rehydrate()
  }
  /*
  TODO: add checkPassword function for methods that requrie password
  async checkPassword(password) {
    const correctPassword = getSessionPersistence().getItem('spendingPassword')
    return correctPassword === password
  }
  */

  async syncWallet() {
    await this.rehydrate()
    const store = useVault.getState()
    await store._syncWallet()
  }
}

export const vaultService = VaultService.getInstance()
