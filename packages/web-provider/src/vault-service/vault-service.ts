import { ChainSignablePayload, GetPassphrase } from '@palladxyz/key-management'
import { ChainOperationArgs } from '@palladxyz/key-management'
import { useVault } from '@palladxyz/vault'

import { chainIdToNetwork } from '../utils'
import { IVaultService } from './types'

export class VaultService implements IVaultService {
  private static instance: VaultService

  private constructor(exampleArg?: boolean) {
    console.log('exampleArg: ', exampleArg)
  }

  public static getInstance(): VaultService {
    if (!VaultService.instance) {
      VaultService.instance = new VaultService()
    }
    return VaultService.instance
  }

  getAccounts(): string[] {
    // TODO: handle errors
    const store = useVault.getState()
    const credentials = store.credentials
    const addresses = Object.values(credentials).map(
      (cred) => cred?.credential?.address
    )
    return addresses.filter(
      (address): address is string => address !== undefined
    )
  }

  async sign(
    signable: ChainSignablePayload,
    args: ChainOperationArgs,
    getPassphrase: GetPassphrase
  ): Promise<unknown> {
    const store = useVault.getState()
    console.log('signable: ', signable)
    return store.sign(signable, args, getPassphrase)
  }
  /*
  async sign(
    signable: ChainSignablePayload,
    args: ChainOperationArgs,
    //getPassphrase: GetPassphrase
  ): Promise<unknown> {
    const store = useVault.getState()
    // request needs name, credential, signable, args
    // get current keyagent name
    // get current crednetial
    const currentWallet = store.getCurrentWallet()
    const keyAgentName = currentWallet.singleKeyAgentState?.name as string
    const credential = currentWallet.credential.credential as GroupedCredentials
    console.log('keyAgentName: ', keyAgentName)
    console.log('credential: ', credential)
    console.log('signable: ', signable)
    console.log('args: ', args)
    return store.request(keyAgentName, credential, signable, args)
  }
  */

  getEnabled(): boolean {
    const store = useVault.getState()
    return store.enabled
  }

  setEnabled(enabled: boolean): void {
    const store = useVault.getState()
    store.setEnabled(enabled)
  }

  getBalance(): number {
    const store = useVault.getState()
    return Number(
      store.getCurrentWallet().accountInfo['MINA']!.balance.total / 1e9
    ) as number
  }

  async getChainId(): Promise<string | undefined> {
    const store = useVault.getState()
    return store.getChainId()
  }

  async getChainIds(): Promise<string[] | undefined> {
    const store = useVault.getState()
    return store.getChainIds()
  }

  switchNetwork(network: string): Promise<void> {
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
