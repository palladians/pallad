import {
  ChainOperationArgs,
  ChainSignablePayload,
  GetPassphrase
} from '@palladxyz/key-management'
import { SingleObjectState } from '@palladxyz/vault'

import { ZkAppUrl } from './vault-service'

export interface IVaultService {
  getAccounts(): Promise<string[]>
  sign(
    signable: ChainSignablePayload,
    args: ChainOperationArgs,
    getPassphrase: GetPassphrase
  ): Promise<unknown>
  getBalance(): Promise<number>
  getChainId(): Promise<string | undefined>
  getChainIds(): Promise<string[]>
  setState(state: SingleObjectState): Promise<void>
  getEnabled({ origin }: { origin: ZkAppUrl }): Promise<boolean>
  setEnabled({ origin }: { origin: ZkAppUrl }): Promise<void>
  switchNetwork(network: string): Promise<void>
  isLocked(): Promise<boolean>
  // Add other method signatures as needed
}
