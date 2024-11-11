import type {
  ChainOperationArgs,
  ChainSignablePayload,
  GetPassphrase,
} from "@palladco/key-management"

import type { Json, Sendable } from "@mina-js/utils"
import type { ProviderConfig } from "@palladco/providers"
import type { SearchQuery, StoredObject } from "@palladco/vault"

export interface IVaultService {
  getAccounts(): Promise<string[]>
  sign(
    signable: ChainSignablePayload,
    args: ChainOperationArgs,
    getPassphrase: GetPassphrase,
  ): Promise<unknown>
  getBalance(): Promise<number>
  getNetworkId(): Promise<string | undefined>
  getNetworkIds(): Promise<string[]>
  setState(state: Json): Promise<void>
  storePrivateCredential(state: Json): Promise<void>
  getPrivateCredential(query?: SearchQuery): Promise<StoredObject[]>
  getEnabled({ origin }: { origin: string }): Promise<boolean>
  setEnabled({ origin }: { origin: string }): Promise<void>
  switchNetwork(
    networkId: string,
  ): Promise<{ name: string; slug: string; url: string }>
  isLocked(): Promise<boolean>
  submitTransaction(sendable: Sendable): Promise<{ hash: string }>
  getState(params: SearchQuery, props?: string[]): Promise<StoredObject[]>
  isBlocked({ origin }: { origin: string }): Promise<boolean>
  addChain(
    providerConfig: ProviderConfig,
  ): Promise<{ slug: string; name: string; url: string }>
  requestNetwork(): Promise<{ slug: string; name: string; url: string }>
  unlockWallet(spendingPassword: string): Promise<void>
}
