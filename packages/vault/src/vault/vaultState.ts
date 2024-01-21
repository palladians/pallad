import {
  ChainAddress,
  ChainSignablePayload,
  ChainSpecificArgs,
  ChainSpecificPayload,
  FromBip39MnemonicWordsProps,
  Network
} from '@palladxyz/key-management'
import { GetPassphrase } from '@palladxyz/key-management'
import { AccountInfo, Mina, SubmitTxArgs } from '@palladxyz/mina-core'
import { Multichain } from '@palladxyz/multi-chain-core'
import { ProviderConfig } from '@palladxyz/providers'

import {
  CredentialName,
  SingleCredentialState,
  StoredCredential
} from '../credentials'
import { KeyAgentName, KeyAgents, SingleKeyAgentState } from '../keyAgent'
import { NetworkName } from '../network-info'
import { SearchQuery } from '../utils/utils'

type CurrentWallet = {
  singleKeyAgentState: SingleKeyAgentState | undefined
  credential: SingleCredentialState
  accountInfo: Record<string, AccountInfo> // string here is token ticker
  transactions: Record<string, Mina.TransactionBody[]> // string here is token ticker
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
  walletNetwork: Multichain.MultiChainNetworks
  walletName: string
}

type CreateWalletReturn = {
  mnemonic: string[]
}

export type GlobalVaultActions = {
  setChain: (chain: Network) => void
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
  getWalletAccountInfo: () => Promise<unknown>
  getWalletTransactions: () => Promise<unknown[]>
  sign: (
    signable: ChainSignablePayload,
    getPassphrase: GetPassphrase
  ) => Promise<unknown>
  constructTx: (
    transaction: Mina.TransactionBody,
    kind: Mina.TransactionKind
  ) => Promise<unknown>
  submitTx: (submitTxArgs: SubmitTxArgs) => Promise<unknown>
  createWallet: (strength?: number) => Promise<CreateWalletReturn>
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
}

export type GlobalVaultStore = GlobalVaultState & GlobalVaultActions
