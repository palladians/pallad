import { ChainSignablePayload, GetPassphrase } from '@palladxyz/key-management'
import { ChainOperationArgs } from '@palladxyz/key-management'
import {
  getSecurePersistence,
  getSessionPersistence
} from '@palladxyz/persistence'
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
      store.getCurrentWallet().accountInfo['MINA']!.balance.total / 1e9
    ) as number
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
    }
  }

  rehydrate() {
    return useVault.persist.rehydrate()
  }
}

export const vaultService = VaultService.getInstance()
