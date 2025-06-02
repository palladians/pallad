import type {
  ChainAddress,
  ChainDerivationArgs,
  ChainOperationArgs,
  ChainSignablePayload,
  FromBip39MnemonicWordsProps,
} from "@palladco/key-management"
import type { GetPassphrase } from "@palladco/key-management"
import type {
  AccountInfo,
  Network,
  SubmitTxArgs,
  Tx,
} from "@palladco/pallad-core"
import type { ProviderConfig } from "@palladco/providers"

import type { TransactionBody } from "@mina-js/utils"
import type {
  CredentialName,
  SingleCredentialState,
  StoredCredential,
} from "../credentials"
import type { KeyAgentName, KeyAgents, SingleKeyAgentState } from "../keyAgent"
import type { NetworkId } from "../network-info"
import type { SearchQuery } from "../utils/utils"

// Note: this is the full state of the account not just 'MINA' tokens
export type CurrentWallet = {
  singleKeyAgentState: SingleKeyAgentState | undefined
  credential: SingleCredentialState
  accountInfo: Record<string, AccountInfo> // string here is token ticker
  transactions: Record<string, Tx[]> // string here is token ticker
}

export type CurrentWalletPayload = {
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
  walletNetworkId: string
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
  updateCurrentWallet: (payload: CurrentWalletPayload) => void
  _setCurrentWallet: (payload: CurrentWalletPayload) => void
  _syncAccountInfo: (
    providerConfig: ProviderConfig,
    publicKey: ChainAddress,
  ) => Promise<void>
  _syncTransactions: (
    providerConfig: ProviderConfig,
    publicKey: ChainAddress,
  ) => Promise<void>
  _syncWallet: (networkId?: NetworkId) => Promise<void>
  getCurrentNetworkId: () => string
  switchNetwork: (networkId: NetworkId) => Promise<void>
  getCredentials: (query: SearchQuery, props: string[]) => StoredCredential[]
  getWalletAccountInfo: () => unknown
  getWalletTransactions: () => unknown[]
  sign: (
    signable: ChainSignablePayload,
    args: ChainOperationArgs,
    getPassphrase: GetPassphrase,
  ) => Promise<unknown>
  constructTx: (args: { transaction: any }) => TransactionBody
  submitTx: (submitTxArgs: SubmitTxArgs) => Promise<string>
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
  getNetworkId: () => string
  deriveNewAccount: (credentialName: string) => Promise<void>
}

export type GlobalVaultStore = GlobalVaultState & GlobalVaultActions
