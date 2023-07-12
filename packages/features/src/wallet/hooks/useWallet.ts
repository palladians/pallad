import { MinaNetwork, Network } from '@palladxyz/key-management'
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
  [MinaNetwork[MinaNetwork.Mainnet]]: new URL(
    import.meta.env.VITE_APP_MINA_PROXY_MAINNET_URL
  ),
  [MinaNetwork[MinaNetwork.Devnet]]: new URL(
    import.meta.env.VITE_APP_MINA_PROXY_DEVNET_URL
  ),
  [MinaNetwork[MinaNetwork.Berkeley]]: new URL(
    import.meta.env.VITE_APP_MINA_PROXY_BERKELEY_URL
  )
}

const MinaExplorerUrl = {
  [MinaNetwork[MinaNetwork.Mainnet]]: new URL(
    import.meta.env.VITE_APP_MINA_EXPLORER_MAINNET_URL
  ),
  [MinaNetwork[MinaNetwork.Devnet]]: new URL(
    import.meta.env.VITE_APP_MINA_EXPLORER_DEVNET_URL
  ),
  [MinaNetwork[MinaNetwork.Berkeley]]: new URL(
    import.meta.env.VITE_APP_MINA_EXPLORER_BERKELEY_URL
  )
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
  const txSubmitProvider = new TxSubmitGraphQLProvider(minaProxyUrl.toString())
  const chainHistoryProvider = new ChainHistoryGraphQLProvider(
    minaExplorerUrl.toString()
  )
  const accountInfoProvider = new AccountInfoGraphQLProvider(
    minaProxyUrl.toString()
  )
  const wallet = new MinaWalletImpl(
    { name: 'Pallad' },
    {
      keyAgent: keyAgentStore.getState().keyAgent,
      txSubmitProvider,
      chainHistoryProvider,
      accountInfoProvider,
      network: Network.Mina
    }
  )
  return {
    wallet
  }
}
