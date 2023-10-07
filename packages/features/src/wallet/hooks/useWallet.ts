import { Mina } from '@palladxyz/mina-core'
import {
  MinaWalletImpl,
  NetworkManager,
  ProviderManager
} from '@palladxyz/mina-wallet'
import { Multichain } from '@palladxyz/multi-chain-core'
import { getSessionPersistence } from '@palladxyz/persistence'
import { toast } from '@palladxyz/ui'
/*import {
  AccountStore,
  accountStore,
  CredentialStore,
  credentialStore,
  KeyAgentStore,
  keyAgentStore,
  SingleCredentialState
} from '@palladxyz/vault'*/
import easyMeshGradient from 'easy-mesh-gradient'
import { useEffect, useMemo, useState } from 'react'
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
  const { network, setNetwork } = useAppStore(
    (state) => ({
      network: state.network,
      setNetwork: state.setNetwork
    }),
    shallow
  )

  // useState for the address
  const [address, setAddress] = useState<string | null>(null)

  // Memoized Values
  const wallet = useMemo(() => {
    console.log('Creating a new wallet instance...')
    const properties = {
      network: network,
      name: 'Pallad'
    }

    const dependencies = {
      networkManager: new NetworkManager<Multichain.MultiChainNetworks>(
        networkConfigurations,
        Mina.Networks.MAINNET
      ),
      providerManager: new ProviderManager<Multichain.MultiChainNetworks>(
        networkConfigurations
      )
    }

    return new MinaWalletImpl(properties, dependencies)
  }, [network])

  console.log('>>>NTWRK', network)

  // useEffect to listen for the walletRestored event.
  useEffect(() => {
    console.log('Subscribing to walletRestored event...')
    // Define a handler for the walletRestored event.
    function handleWalletRestored(address: string) {
      // Perform any updates or side effects when the wallet is restored.
      console.log('Wallet restored with address:', address)
      setAddress(address)
      console.log('Address state immediately after update:', address)
      // ... any other logic ...

      // If we have any state tied to wallet properties, we can update it here, in this handler.
      // For example, if we use useState to manage the address, balances, transactions
    }

    // Subscribe to the walletRestored event.
    wallet.on('walletRestored', handleWalletRestored)

    // Cleanup: Unsubscribe from the event on component unmount.
    return () => {
      wallet.off('walletRestored', handleWalletRestored)
    }
  }, []) // Dependency on the wallet instance to ensure the effect runs when the wallet instance changes.

  const gradientBackground = useMemo(
    () =>
      address &&
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
    // maybe we can return an object that contains all relevant wallet states
    address,
    gradientBackground,
    lockWallet
  }
}
