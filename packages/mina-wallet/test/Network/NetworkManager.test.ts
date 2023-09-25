import { Mina } from '@palladxyz/mina-core'
import { Multichain } from '@palladxyz/multi-chain-core'

import { NetworkManager } from '../../src/Network/NetworkManager'

describe('NetworkManager', () => {
  let providerConfigurations: Partial<
    Record<Multichain.MultiChainNetworks, Multichain.MultichainProviderConfig>
  >
  let defaultNetwork: Multichain.MultiChainNetworks

  beforeEach(() => {
    providerConfigurations = {
      [Mina.Networks.MAINNET]: {
        nodeUrl: 'https://proxy.mainnet.minaexplorer.com/',
        archiveUrl: 'https://mainnet.graphql.minaexplorer.com'
      },
      [Mina.Networks.DEVNET]: {
        nodeUrl: 'https://proxy.devnet.minaexplorer.com/',
        archiveUrl: 'https://devnet.graphql.minaexplorer.com'
      },
      [Mina.Networks.BERKELEY]: {
        nodeUrl: 'https://proxy.berkeley.minaexplorer.com/',
        archiveUrl: 'https://berkeley.graphql.minaexplorer.com'
      }
    }
    defaultNetwork = Mina.Networks.MAINNET
  })

  test('should initialize with default network', () => {
    const manager = new NetworkManager(providerConfigurations, defaultNetwork)
    expect(manager.getActiveProvider()).not.toBeNull()
  })

  test('should switch to a different network', () => {
    const manager = new NetworkManager(providerConfigurations, defaultNetwork)
    manager.switchNetwork(Mina.Networks.BERKELEY)
    expect(
      manager.getActiveProvider()?.specificProvider.nodeProvider.providerUrl
    ).toBe('https://proxy.berkeley.minaexplorer.com/')
  })

  test('should emit network change event', () => {
    const manager = new NetworkManager(providerConfigurations, defaultNetwork)

    // Return a new promise, and resolve it once the callback is executed
    return new Promise<void>((resolve) => {
      manager.onNetworkChanged((network) => {
        expect(network).toBe(Mina.Networks.BERKELEY)
        resolve()
      })
      manager.switchNetwork(Mina.Networks.BERKELEY)
    })
  })

  test('should return the list of available networks', () => {
    const manager = new NetworkManager(providerConfigurations, defaultNetwork)
    const availableNetworks = manager.getAvailableNetworks()
    expect(availableNetworks).toContain(Mina.Networks.MAINNET)
    expect(availableNetworks).toContain(Mina.Networks.DEVNET)
    expect(availableNetworks).toContain(Mina.Networks.BERKELEY)
  })
})
