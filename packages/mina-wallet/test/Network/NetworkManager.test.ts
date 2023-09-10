import { Mina } from '@palladxyz/mina-core'

import {
  NetworkConfigurations,
  NetworkManager
} from '../../src/Network/NetworkManager'

describe('NetworkManager', () => {
  let networkConfigurations: NetworkConfigurations
  let defaultNetwork: Mina.Networks

  beforeEach(() => {
    networkConfigurations = {
      [Mina.Networks.MAINNET]: {
        provider: 'https://proxy.mainnet.minaexplorer.com/',
        archive: 'https://mainnet.graphql.minaexplorer.com'
      },
      [Mina.Networks.DEVNET]: {
        provider: 'https://proxy.devnet.minaexplorer.com/',
        archive: 'https://devnet.graphql.minaexplorer.com'
      },
      [Mina.Networks.BERKELEY]: {
        provider: 'https://proxy.berkeley.minaexplorer.com/',
        archive: 'https://berkeley.graphql.minaexplorer.com'
      }
    }
    defaultNetwork = Mina.Networks.MAINNET
  })

  test('should initialize with default network', () => {
    const manager = new NetworkManager(networkConfigurations, defaultNetwork)
    expect(manager.getActiveProvider()).not.toBeNull()
    expect(manager.getActiveArchiveProvider()).not.toBeNull()
  })

  test('should switch to a different network', () => {
    const manager = new NetworkManager(networkConfigurations, defaultNetwork)
    manager.switchNetwork(Mina.Networks.BERKELEY)
    expect(manager.getActiveProvider()?.providerUrl).toBe(
      'https://proxy.berkeley.minaexplorer.com/'
    )
  })

  test('should emit network change event', () => {
    const manager = new NetworkManager(networkConfigurations, defaultNetwork)

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
    const manager = new NetworkManager(networkConfigurations, defaultNetwork)
    const availableNetworks = manager.getAvailableNetworks()
    expect(availableNetworks).toContain(Mina.Networks.MAINNET)
    expect(availableNetworks).toContain(Mina.Networks.DEVNET)
    expect(availableNetworks).toContain(Mina.Networks.BERKELEY)
  })
})
