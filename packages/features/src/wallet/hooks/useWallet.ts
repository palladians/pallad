import { MinaNetwork, Network } from '@palladxyz/key-management'
import { Mina } from '@palladxyz/mina-core'
import { MinaArchiveProvider, MinaProvider } from '@palladxyz/mina-graphql'
import { MinaWalletImpl } from '@palladxyz/mina-wallet'
import { keyAgentStore } from '@palladxyz/vault'
import { useMemo } from 'react'
import { shallow } from 'zustand/shallow'

import { useAppStore } from '../store/app'

const MinaProxyUrl = {
  [MinaNetwork[MinaNetwork.Mainnet]]: import.meta.env
    .VITE_APP_MINA_PROXY_MAINNET_URL,
  [MinaNetwork[MinaNetwork.Devnet]]: import.meta.env
    .VITE_APP_MINA_PROXY_DEVNET_URL,
  [MinaNetwork[MinaNetwork.Berkeley]]: import.meta.env
    .VITE_APP_MINA_PROXY_BERKELEY_URL
}

const MinaExplorerUrl = {
  [MinaNetwork[MinaNetwork.Mainnet]]: import.meta.env
    .VITE_APP_MINA_EXPLORER_MAINNET_URL,
  [MinaNetwork[MinaNetwork.Devnet]]: import.meta.env
    .VITE_APP_MINA_EXPLORER_DEVNET_URL,
  [MinaNetwork[MinaNetwork.Berkeley]]: import.meta.env
    .VITE_APP_MINA_EXPLORER_BERKELEY_URL
}

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

export const useWallet = () => {
  const { network, setNetwork } = useAppStore(
    (state) => ({
      network: state.network,
      setNetwork: state.setNetwork
    }),
    shallow
  )
  const minaProxyUrl = useMemo(() => MinaProxyUrl[network], [network])
  const minaExplorerUrl = useMemo(() => MinaExplorerUrl[network], [network])
  const provider = new MinaProvider(minaProxyUrl)
  const providerArchive = new MinaArchiveProvider(minaExplorerUrl)
  const wallet = new MinaWalletImpl(
    { name: 'Pallad' },
    {
      keyAgent: keyAgentStore.getState().keyAgent,
      minaProvider: provider,
      minaArchiveProvider: providerArchive,
      network: Network.Mina
    }
  )
  console.log('>>>W', wallet)
  const switchNetwork = async (network: MinaNetwork) => {
    setNetwork(network)
    await wallet.switchNetwork(
      getNetworkValue(network),
      minaProxyUrl,
      minaExplorerUrl
    )
  }
  return {
    wallet,
    switchNetwork
  }
}
