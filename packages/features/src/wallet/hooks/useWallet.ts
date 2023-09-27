import { GroupedCredentials } from '@palladxyz/key-management'
import { Mina } from '@palladxyz/mina-core'
import {
  MinaWalletImpl,
  NetworkManager,
  ProviderManager
} from '@palladxyz/mina-wallet'
import { Multichain } from '@palladxyz/multi-chain-core'
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

// Load environment variables
const networkConfigurations = {
  [Mina.Networks.MAINNET]: {
    nodeUrl: import.meta.env.VITE_APP_MINA_PROXY_MAINNET_URL,
    archiveUrl: import.meta.env.VITE_APP_MINA_EXPLORER_MAINNET_URL
  },
  [Mina.Networks.DEVNET]: {
    nodeUrl: import.meta.env.VITE_APP_MINA_PROXY_DEVNET_URL,
    archiveUrl: import.meta.env.VITE_APP_MINA_EXPLORER_DEVNET_URL
  },
  [Mina.Networks.BERKELEY]: {
    nodeUrl: import.meta.env.VITE_APP_MINA_PROXY_BERKELEY_URL,
    archiveUrl: import.meta.env.VITE_APP_MINA_EXPLORER_BERKELEY_URL
  }
}

export const useWallet = () => {
  const navigate = useNavigate()
  // The use App Store should be an API on the wallet
  const { network: network, setNetwork } = useAppStore(
    (state) => ({
      network: state.network,
      setNetwork: state.setNetwork
    }),
    shallow
  )

  // Memoized Values
  const walletProperties = useMemo(
    () => ({
      network: network,
      name: 'Pallad'
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
      networkManager: new NetworkManager<Multichain.MultiChainNetworks>(
        networkConfigurations,
        Mina.Networks.MAINNET
      ),
      providerManager: new ProviderManager<Multichain.MultiChainNetworks>(
        networkConfigurations
      )
    }),
    []
  )
  const wallet = useMemo(
    () => new MinaWalletImpl(walletProperties, walletDependencies),
    [walletProperties, walletDependencies]
  )

  const address = useMemo(() => {
    const credential = wallet.getCurrentWallet()
      ?.credential as GroupedCredentials
    return credential ? credential.address : 'undefined'
  }, [wallet])

  const gradientBackground = useMemo(
    () =>
      easyMeshGradient({
        seed: address,
        hueRange: [180, 240]
      }),
    [address]
  )

  const switchNetwork = async (network: Mina.Networks) => {
    setNetwork(network)
    await wallet.switchNetwork(network)
  }

  const copyWalletAddress = async () => {
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
