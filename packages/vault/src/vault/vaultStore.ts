import { Network } from '@palladxyz/key-management'
import { Networks } from '@palladxyz/mina-core'
import { getSecurePersistence } from '@palladxyz/persistence'
import { produce } from 'immer'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { accountSlice, AccountStore } from '../account'
import { credentialSlice, CredentialStore } from '../credentials'
import { keyAgentSlice, KeyAgentStore } from '../keyAgent'
import { providerSlice, ProviderStore } from '../providers'
import { GlobalVaultState, GlobalVaultStore } from './vaultState'

const defaultGlobalVaultState: GlobalVaultState = {
  keyAgentName: '',
  credentialName: '',
  currentAccountIndex: 0,
  currentAddressIndex: 0,
  chain: Network.Mina
}

export const useVault = create<
  AccountStore &
    CredentialStore &
    KeyAgentStore &
    ProviderStore &
    GlobalVaultStore
>()(
  persist(
    (set, get, store) => ({
      ...accountSlice(set, get, store),
      ...credentialSlice(set, get, store),
      ...keyAgentSlice(set, get, store),
      ...providerSlice(set, get, store),
      ...defaultGlobalVaultState,
      setChain(chain) {
        return set(
          produce((state) => {
            state.chain = chain
          })
        )
      },
      setCurrentWallet(payload) {
        return set(
          produce((state) => {
            state.keyAgentName = payload.keyAgentName
            state.credentialName = payload.credentialName
            state.currentAccountIndex = payload.currentAccountIndex
            state.currentAddressIndex = payload.currentAddressIndex
          })
        )
      },
      getCurrentWallet() {
        const {
          getKeyAgent,
          keyAgentName,
          getCredential,
          credentialName,
          getAccountInfo
        } = get()
        return {
          keyAgent: getKeyAgent(keyAgentName),
          credential: getCredential(credentialName),
          accountInfo: getAccountInfo(Networks.MAINNET, 'ADD ADDRESS HERE')
            .accountInfo,
          transactions: []
        }
      }
    }),
    { name: 'PalladVault', storage: createJSONStorage(getSecurePersistence) }
  )
)
