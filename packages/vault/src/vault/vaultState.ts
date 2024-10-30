import type {
  ChainAddress,
  ChainDerivationArgs,
  ChainOperationArgs,
  ChainSignablePayload,
  FromBip39MnemonicWordsProps,
} from "@palladxyz/key-management"
import type { GetPassphrase } from "@palladxyz/key-management"
import type {
  AccountInfo,
  Network,
  PalladNetworkNames,
  SubmitTxArgs,
  Tx,
} from "@palladxyz/pallad-core"
import type { ProviderConfig } from "@palladxyz/providers"

import type { TransactionBody } from "@mina-js/utils"
import type {
  CredentialName,
  SingleCredentialState,
  StoredCredential,
} from "../credentials"
import type { KeyAgentName, KeyAgents, SingleKeyAgentState } from "../keyAgent"
import type { NetworkName } from "../network-info"
import type { SearchQuery } from "../utils/utils"

// Note: this is the full state of the account not just 'MINA' tokens
export type CurrentWallet = {
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
  chain: Network
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
    publicKey: ChainAddress,
  ) => Promise<void>
  _syncTransactions: (
    providerConfig: ProviderConfig,
    publicKey: ChainAddress,
  ) => Promise<void>
  _syncWallet: (networkName?: NetworkName) => Promise<void>
  getCurrentNetwork: () => string
  switchNetwork: (networkName: NetworkName) => Promise<void>
  getCredentials: (query: SearchQuery, props: string[]) => StoredCredential[]
  getWalletAccountInfo: () => unknown
  getWalletTransactions: () => unknown[]
  sign: (
    signable: ChainSignablePayload,
    args: ChainOperationArgs,
    getPassphrase: GetPassphrase,
  ) => Promise<unknown>
  constructTx: (args: { transaction: any }) => TransactionBody
  submitTx: (submitTxArgs: SubmitTxArgs) => Promise<unknown>
  createWallet: (strength?: number) => CreateWalletReturn
  restoreWallet: (
    args: ChainDerivationArgs,
    network: string,
    { mnemonicWords, getPassphrase }: FromBip39MnemonicWordsProps,
    keyAgentName: KeyAgentName,
    keyAgentType: KeyAgents,
    credentialName: CredentialName,
  ) => Promise<void>
  restartWallet: () => void
  // web provider APIs
  getAccounts: () => string[]
  getBalance: (ticker?: string) => number
  getChainId: () => string
}

export type GlobalVaultStore = GlobalVaultState & GlobalVaultActions
