import { InMemoryKeyAgent, Network } from '@palladxyz/key-management'
import { Multichain } from '@palladxyz/multi-chain-core'

import { SingleCredentialState } from '../credentials'

type CurrentWallet = {
  keyAgent: InMemoryKeyAgent | undefined
  credential: SingleCredentialState
  accountInfo: Multichain.MultiChainAccountInfo
  transactions: Multichain.MultiChainTransactionBody[]
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
}

export type GlobalVaultActions = {
  setChain: (chain: Network) => void
  getCurrentWallet: () => CurrentWallet
  setCurrentWallet: (payload: CurrentWalletPayload) => void
}

export type GlobalVaultStore = GlobalVaultState & GlobalVaultActions
