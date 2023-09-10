import { Mina } from '@palladxyz/mina-core'

import { NetworkConfigurations } from '../../src/Network'
import { ProviderManager } from '../../src/Provider/ProviderManager'

describe('ProviderManager', () => {
  let providerConfigurations: NetworkConfigurations
  let network: Mina.Networks

  beforeEach(() => {
    providerConfigurations = {
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
    network = Mina.Networks.MAINNET
  })

  test('should initialize with default provider', () => {
    const manager = new ProviderManager(providerConfigurations)
    expect(manager.getArchiveProvider(network)).not.toBeNull()
    expect(manager.getProvider(network)).not.toBeNull()
  })
})
