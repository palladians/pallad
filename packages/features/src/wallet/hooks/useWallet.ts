import { GroupedCredentials, MinaNetwork } from '@palladxyz/key-management'
import { Mina } from '@palladxyz/mina-core'
import {
  MinaWalletImpl,
  NetworkManager,
  ProviderManager
} from '@palladxyz/mina-wallet'
import { getSessionPersistence } from '@palladxyz/persistence'
import { toast } from '@palladxyz/ui'
import {
  AccountStore,
  CredentialStore,
  KeyAgentStore
} from '@palladxyz/vaultv2'
import easyMeshGradient from 'easy-mesh-gradient'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { shallow } from 'zustand/shallow'

import { useAppStore } from '../store/app'

// TODO: Remove mapping once network types are unified
const getNetworkValue = (network: MinaNetwork) => {
  switch (network) {
    case MinaNetwork.Mainnet:
      return Mina.Networks.MAINNET
    case MinaNetwork.Devnet:
      return Mina.Networks.DEVNET
    case MinaNetwork.Berkeley:
      return Mina.Networks.BERKELEY
  }
}

// Load environment variables
// TODO: this is in the scope of the Network & Provider Managers
const providers = {
  [Mina.Networks.MAINNET]: {
    provider: import.meta.env.VITE_APP_MINA_PROXY_MAINNET_URL,
    archive: import.meta.env.VITE_APP_MINA_EXPLORER_MAINNET_URL
  },
  [Mina.Networks.DEVNET]: {
    provider: import.meta.env.VITE_APP_MINA_PROXY_DEVNET_URL,
    archive: import.meta.env.VITE_APP_MINA_EXPLORER_DEVNET_URL
  },
  [Mina.Networks.BERKELEY]: {
    provider: import.meta.env.VITE_APP_MINA_PROXY_BERKELEY_URL,
    archive: import.meta.env.VITE_APP_MINA_EXPLORER_BERKELEY_URL
  }
}

export const useWallet = () => {
  const navigate = useNavigate()
  const { network: networkEnum, setNetwork } = useAppStore(
    (state) => ({
      network: state.network,
      setNetwork: state.setNetwork
    }),
    shallow
  )
  const network = getNetworkValue(networkEnum)
  const walletProperties = useMemo(
    () => ({
      network,
      name: 'Pallad',
      providers
    }),
    [network]
  )
  const walletDependencies = useMemo(
    () => ({
      // stores
      accountStore: new AccountStore(),
      credentialStore: new CredentialStore(),
      keyAgentStore: new KeyAgentStore(),

      // managers
      networkManager: new NetworkManager(providers, Mina.Networks.BERKELEY),
      providerManager: new ProviderManager(providers)
    }),
    []
  )
  const wallet = useMemo(
    // TODO: update the dependencies with new wallet stores and managers
    () => new MinaWalletImpl(walletProperties, walletDependencies),
    [walletProperties, walletDependencies]
  )
  const walletCredential = wallet.getCurrentWallet()
    ?.credential as GroupedCredentials
  console.log(`Wallet Credential: ${JSON.stringify(walletCredential)}`)
  const address = useMemo(() => walletCredential.address, [wallet])
  const gradientBackground = useMemo(
    () =>
      easyMeshGradient({
        seed: address,
        hueRange: [180, 240]
      }),
    [address]
  )

  const switchNetwork = async (network: MinaNetwork) => {
    setNetwork(network)
    await wallet.switchNetwork(getNetworkValue(network))
  }

  const copyWalletAddress = async () => {
    const walletCredential = wallet.getCurrentWallet()
      ?.credential as GroupedCredentials
    const address = walletCredential.address
    await navigator.clipboard.writeText(address || '')
    toast({
      title: 'Wallet address was copied.'
    })
  }

  const lockWallet = () => {
    getSessionPersistence().setItem('spendingPassword', '')
    // TODO: create a store manager for keyAgentStore, accountStore, credentialStore
    // store.destory()? Maybe we don't have to do this
    // store.persist.rehydrate()
    wallet.rehydrateStores()
    return navigate('/')
  }

  return {
    wallet,
    switchNetwork,
    copyWalletAddress,
    address,
    gradientBackground,
    lockWallet
  }
}
