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

  getAddresses() {
    const store = useVault.getState()
    const credentials = store.credentials
    const addresses = Object.values(credentials).map(
      (cred) => cred?.credential?.address
    )
    return addresses
  }

  // Add other methods as needed
}

export const vaultService = VaultService.getInstance()
