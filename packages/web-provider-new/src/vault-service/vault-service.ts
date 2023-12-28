import { ChainSignablePayload, GetPassphrase } from '@palladxyz/key-management'
import { useVault } from '@palladxyz/vault'

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
    getPassphrase: GetPassphrase
  ): Promise<unknown> {
    const store = useVault.getState()
    return store.sign(signable, getPassphrase)
  }

  getBalance(): number {
    const store = useVault.getState()
    return Number(store.getCurrentWallet().accountInfo.balance.total / 1e9)
  }

  async getChainId(): Promise<string | undefined> {
    const store = useVault.getState()
    return store.getChainId()
  }

  // Add other methods as needed
}

export const vaultService = VaultService.getInstance()
