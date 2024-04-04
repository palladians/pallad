import { ChainSignablePayload, GetPassphrase } from '@palladxyz/key-management'
import { ChainOperationArgs } from '@palladxyz/key-management'
import {
  SearchQuery,
  SingleObjectState,
  useVault,
  useWebProviderVault
} from '@palladxyz/vault'

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

  getAccounts() {
    // TODO: handle errors
    const store = useVault.getState()
    const credentials = store.credentials
    const addresses = Object.values(credentials).map(
      (cred) => cred?.credential?.address
    )
    return addresses.filter((address) => address !== undefined) as string[]
  }

  sign(
    signable: ChainSignablePayload,
    args: ChainOperationArgs,
    getPassphrase: GetPassphrase
  ) {
    const store = useVault.getState()
    return store.sign(signable, args, getPassphrase)
  }

  getState(params: SearchQuery, props?: string[]) {
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
      return store.searchObjs(params)
    } else {
      return store.searchObjs(params, props)
    }
  }

  setState(state: SingleObjectState) {
    const store = useVault.getState()
    // add the given object to the store
    store.setObj(state)
  }

  getEnabled({ origin }: { origin: ZkAppUrl }) {
    const store = useWebProviderVault.getState()
    // FIXME
    return store.authorized[origin] === AuthorizationState.ALLOWED
  }

  setEnabled({ origin }: { origin: ZkAppUrl }) {
    const store = useWebProviderVault.getState()
    store.mutateZkAppPermission({
      origin,
      authorizationState: AuthorizationState.ALLOWED
    })
  }

  getBalance() {
    const store = useVault.getState()
    return Number(
      store.getCurrentWallet().accountInfo['MINA']!.balance.total / 1e9
    ) as number
  }

  getChainId() {
    const store = useVault.getState()
    return store.getChainId()
  }

  getChainIds() {
    const store = useVault.getState()
    return store.getChainIds()
  }

  switchNetwork(network: string) {
    const store = useVault.getState()
    // map chainId to network
    const networkName = chainIdToNetwork(network)
    if (!networkName) {
      throw new Error(`Invalid chain id: ${network}`)
    }
    return store.switchNetwork(networkName)
  }
}

export const vaultService = VaultService.getInstance()
