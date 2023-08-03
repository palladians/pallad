import { Mina } from '@palladxyz/mina-core'
import { MinaArchiveProvider, MinaProvider } from '@palladxyz/mina-graphql'

export type NewProvider = {
  minaProvider: MinaProvider
  minaArchiveProvider: MinaArchiveProvider
}

export function checkNetwork(
  network: Mina.Networks,
  minaProvider: MinaProvider,
  minaArchiveProvider: MinaArchiveProvider
): NewProvider {
  if (network === Mina.Networks.MAINNET) {
    if (
      minaProvider.providerUrl != 'https://proxy.minaexplorer.com/' ||
      minaArchiveProvider.providerUrl != 'https://graphql.minaexplorer.com'
    ) {
      console.log('MinaProvider Network is not MAINNET')
      const newMinaProvider = new MinaProvider(
        'https://proxy.minaexplorer.com/'
      )
      const newMinaArchiveProvider = new MinaArchiveProvider(
        'https://graphql.minaexplorer.com'
      )
      return {
        minaProvider: newMinaProvider,
        minaArchiveProvider: newMinaArchiveProvider
      }
    }
  } else if (network === Mina.Networks.DEVNET) {
    if (
      minaProvider.providerUrl != 'https://proxy.devnet.minaexplorer.com/' ||
      minaArchiveProvider.providerUrl !=
        'https://devnet.graphql.minaexplorer.com'
    ) {
      console.log('MinaProvider Network is not DEVNET')
      const newMinaProvider = new MinaProvider(
        'https://proxy.devnet.minaexplorer.com/'
      )
      const newMinaArchiveProvider = new MinaArchiveProvider(
        'https://devnet.graphql.minaexplorer.com'
      )
      return {
        minaProvider: newMinaProvider,
        minaArchiveProvider: newMinaArchiveProvider
      }
    }
  } else if (network === Mina.Networks.BERKELEY) {
    if (
      minaProvider.providerUrl != 'https://proxy.berkeley.minaexplorer.com/' ||
      minaArchiveProvider.providerUrl !=
        'https://berkeley.graphql.minaexplorer.com'
    ) {
      console.log('MinaProvider Network is not BERKELEY')
      const newMinaProvider = new MinaProvider(
        'https://proxy.berkeley.minaexplorer.com/'
      )
      const newMinaArchiveProvider = new MinaArchiveProvider(
        'https://berkeley.graphql.minaexplorer.com'
      )
      return {
        minaProvider: newMinaProvider,
        minaArchiveProvider: newMinaArchiveProvider
      }
    }
  } else {
    console.log('Network is not MAINNET, DEVNET or BERKELEY')
  }
  return {
    minaProvider: minaProvider,
    minaArchiveProvider: minaArchiveProvider
  }
}

/*
VITE_APP_MINA_PROXY_MAINNET_URL=https://proxy.minaexplorer.com/
VITE_APP_MINA_EXPLORER_MAINNET_URL=https://graphql.minaexplorer.com/

VITE_APP_MINA_PROXY_DEVNET_URL=https://proxy.devnet.minaexplorer.com/
VITE_APP_MINA_EXPLORER_DEVNET_URL=https://devnet.graphql.minaexplorer.com

VITE_APP_MINA_PROXY_BERKELEY_URL=https://proxy.berkeley.minaexplorer.com/
VITE_APP_MINA_EXPLORER_BERKELEY_URL=https://berkeley.graphql.minaexplorer.com
*/
