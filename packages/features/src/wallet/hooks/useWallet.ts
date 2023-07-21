import { MinaNetwork } from '@palladxyz/key-management-agnostic'
import {
  AccountInfoGraphQLProvider,
  ChainHistoryGraphQLProvider,
  TxSubmitGraphQLProvider
} from '@palladxyz/mina-graphql'
import { MinaWalletImpl } from '@palladxyz/mina-wallet'
import { keyAgentStore } from '@palladxyz/vault'
import { useMemo } from 'react'

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

export const useWallet = () => {
  const currentNetwork = useAppStore((state) => state.network)
  const minaProxyUrl = useMemo(
    () => MinaProxyUrl[currentNetwork],
    [currentNetwork]
  )
  const minaExplorerUrl = useMemo(
    () => MinaExplorerUrl[currentNetwork],
    [currentNetwork]
  )
  const txSubmitProvider = new TxSubmitGraphQLProvider(minaProxyUrl)
  const chainHistoryProvider = new ChainHistoryGraphQLProvider(minaExplorerUrl)
  const accountInfoProvider = new AccountInfoGraphQLProvider(minaProxyUrl)
  const wallet = new MinaWalletImpl(
    { name: 'Pallad' },
    {
      keyAgent: keyAgentStore.getState().keyAgent,
      txSubmitProvider,
      chainHistoryProvider,
      accountInfoProvider
    }
  )
  return {
    wallet
  }
}
