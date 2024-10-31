import type {
  ChainOperationArgs,
  ChainSignablePayload,
  GetPassphrase,
} from "@palladxyz/key-management"

import type { Json, SignedTransaction } from "@mina-js/utils"
import type { ProviderConfig } from "@palladxyz/providers"
import type { SearchQuery, StoredObject } from "@palladxyz/vault"

export interface IVaultService {
  getAccounts(): Promise<string[]>
  sign(
    signable: ChainSignablePayload,
    args: ChainOperationArgs,
    getPassphrase: GetPassphrase,
  ): Promise<unknown>
  getBalance(): Promise<number>
  getChainId(): Promise<string | undefined>
  getChainIds(): Promise<string[]>
  setState(state: Json): Promise<void>
  getEnabled({ origin }: { origin: string }): Promise<boolean>
  setEnabled({ origin }: { origin: string }): Promise<void>
  switchNetwork(network: string): Promise<void>
  isLocked(): Promise<boolean>
  submitTransaction(
    signedTransaction: SignedTransaction,
  ): Promise<{ hash: string }>
  getState(params: SearchQuery, props?: string[]): Promise<StoredObject[]>
  isBlocked({ origin }: { origin: string }): Promise<boolean>
  addChain(
    providerConfig: ProviderConfig,
  ): Promise<{ networkName: string; chainId: string }>
  switchChain(
    chainId: string,
  ): Promise<{ chainId: string; networkName: string }>
  requestNetwork(): Promise<{ chainId: string; networkName: string }>
  unlockWallet(spendingPassword: string): Promise<void>
}
