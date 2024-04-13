import {
  ChainAddress,
  ChainOperationArgs,
  ChainSignablePayload,
  ChainSpecificArgs,
  ChainSpecificPayload,
  FromBip39MnemonicWordsProps,
  Network
} from '@palladxyz/key-management'
import { GetPassphrase } from '@palladxyz/key-management'
// can remove mina-core when there exists an agnostic construct tx function
import { Mina } from '@palladxyz/mina-core'
import {
  AccountInfo,
  PalladNetworkNames,
  PalladNetworkTypes,
  SubmitTxArgs,
  Tx
} from '@palladxyz/pallad-core'
import { ProviderConfig } from '@palladxyz/providers'

import {
  CredentialName,
  SingleCredentialState,
  StoredCredential
} from '../credentials'
import { KeyAgentName, KeyAgents, SingleKeyAgentState } from '../keyAgent'
import { NetworkName } from '../network-info'
import { SearchQuery } from '../utils/utils'

// Note: this is the full state of the account not just 'MINA' tokens
type CurrentWallet = {
  singleKeyAgentState: SingleKeyAgentState | undefined
  credential: SingleCredentialState
  accountInfo: Record<string, AccountInfo> // string here is token ticker
  transactions: Record<string, Tx[]> // string here is token ticker
}

type CurrentWalletPayload = {
  keyAgentName: string
  credentialName: string
  currentAccountIndex: number
  currentAddressIndex: number
}

export type GlobalVaultState = {
  keyAgentName: string
  credentialName: string
  currentAccountIndex: number
  currentAddressIndex: number
  chain: PalladNetworkTypes
  walletNetwork: PalladNetworkNames
  walletName: string
  knownAccounts: string[]
  chainIds: string[]
}

type CreateWalletReturn = {
  mnemonic: string[]
}

export type GlobalVaultActions = {
  setChain: (chain: Network) => void
  setKnownAccounts: (address: string) => void
  getCurrentWallet: () => CurrentWallet
  setCurrentWallet: (payload: CurrentWalletPayload) => void
  _syncAccountInfo: (
    providerConfig: ProviderConfig,
    publicKey: ChainAddress
  ) => Promise<void>
  _syncTransactions: (
    providerConfig: ProviderConfig,
    publicKey: ChainAddress
  ) => Promise<void>
  _syncWallet: () => Promise<void>
  getCurrentNetwork: () => string
  switchNetwork: (networkName: NetworkName) => Promise<void>
  getCredentials: (query: SearchQuery, props: string[]) => StoredCredential[]
  getWalletAccountInfo: () => unknown
  getWalletTransactions: () => unknown[]
  sign: (
    signable: ChainSignablePayload,
    args: ChainOperationArgs,
    getPassphrase: GetPassphrase
  ) => Promise<unknown>
  constructTx: (
    transaction: Mina.TransactionBody,
    kind: Mina.TransactionKind
  ) => unknown
  submitTx: (submitTxArgs: SubmitTxArgs) => Promise<unknown>
  createWallet: (strength?: number) => CreateWalletReturn
  restoreWallet: <T extends ChainSpecificPayload>(
    payload: T,
    args: ChainSpecificArgs,
    network: string,
    { mnemonicWords, getPassphrase }: FromBip39MnemonicWordsProps,
    keyAgentName: KeyAgentName,
    keyAgentType: KeyAgents,
    credentialName: CredentialName
  ) => Promise<void>
  restartWallet: () => void
  // web provider APIs
  getAccounts: () => string[]
  getBalance: (ticker?: string) => number
  getChainId: () => string
}

export type GlobalVaultStore = GlobalVaultState & GlobalVaultActions
