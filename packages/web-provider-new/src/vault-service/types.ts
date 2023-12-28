import { ChainSignablePayload, GetPassphrase } from '@palladxyz/key-management'

export interface IVaultService {
  getAccounts(): string[]
  sign(
    signable: ChainSignablePayload,
    getPassphrase: GetPassphrase
  ): Promise<unknown>
  getBalance(): number
  getChainId(): Promise<string | undefined>
  // Add other method signatures as needed
}
