import { Multichain } from '@palladxyz/multi-chain-core'
import { produce } from 'immer'
import { StateCreator } from 'zustand'

import { initialProviderState, ProviderStore } from './providerState'

export const providerFactory = (
  config: Multichain.MultichainProviderConfig,
  network: Multichain.MultiChainNetworks
): Multichain.MultiChainProvider => {
  return new Multichain.MultiChainProvider(config, network)
}

export const providerSlice: StateCreator<ProviderStore> = (set, get) => ({
  providers: {},
  currentNetwork: '',

  setCurrentNetwork: (networkName) => {
    set(
      produce((state) => {
        state.currentNetwork = networkName
      })
    )
  },

  getCurrentNetwork: () => {
    return get().currentNetwork
  },
  ensureProvider: (networkName, config, network) => {
    set(
      produce((state) => {
        if (!state.providers[networkName]) {
          state.providers[networkName] = {
            ...initialProviderState,
            networkName,
            provider: providerFactory(config, network)
          }
        }
      })
    )
  },
  setProvider: (providerState) => {
    const { networkName, provider } = providerState
    set(
      produce((state) => {
        state.providers[networkName] = provider
      })
    )
  },
  getProvider: (networkName) => {
    const { providers } = get()
    return providers[networkName] || initialProviderState
  },
  removeProvider: (networkName) => {
    set(
      produce((state) => {
        delete state.providers[networkName]
      })
    )
  },
  getAvailableNetworks: () => {
    const providers = get().providers
    return Object.keys(providers)
  },
  clear: () => {
    set(
      produce((state) => {
        state.providers = {}
      })
    )
  }
})
