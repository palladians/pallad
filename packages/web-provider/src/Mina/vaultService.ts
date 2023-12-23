import { ChainSignablePayload, GetPassphrase } from '@palladxyz/key-management'
import { useVault } from '@palladxyz/vault'

export class VaultService {
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
    const store = useVault.getState()
    const credentials = store.credentials
    const addresses = Object.values(credentials).map(
      (cred) => cred?.credential?.address
    )
    return addresses
  }

  async sign(
    signable: ChainSignablePayload,
    getPassphrase: GetPassphrase
  ): Promise<unknown> {
    const store = useVault.getState()
    return store.sign(signable, getPassphrase)
  }

  // Add other methods as needed
}

export const vaultService = VaultService.getInstance()
