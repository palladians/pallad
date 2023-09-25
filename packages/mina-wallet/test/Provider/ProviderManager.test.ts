import { Mina } from '@palladxyz/mina-core'
import { Multichain } from '@palladxyz/multi-chain-core'

import { ProviderManager } from '../../src/Provider/ProviderManager'

describe('ProviderManager', () => {
  let providerConfigurations: Partial<
    Record<Multichain.MultiChainNetworks, Multichain.MultichainProviderConfig>
  >
  let network: Multichain.MultiChainNetworks

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
    network = Mina.Networks.DEVNET
  })

  it('should initialize with default provider', () => {
    const manager = new ProviderManager<Multichain.MultiChainNetworks>(
      providerConfigurations
    )
    console.log('manager', manager)
    expect(manager.getProvider(network)).not.toBeNull()
  })

  it('should call getAccountInfo on the active provider', async () => {
    const manager = new ProviderManager<Multichain.MultiChainNetworks>(
      providerConfigurations
    )
    const args = {
      publicKey: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'
    }
    const accountInfo = await manager.getProvider(network)?.getAccountInfo(args)
    expect(accountInfo).not.toBeNull()
  })
})
