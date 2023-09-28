import { Mina } from '@palladxyz/mina-core'
import { Multichain } from '@palladxyz/multi-chain-core'
import { EventEmitter } from 'events'

import { ProviderManager } from '../Provider/ProviderManager'

class NetworkManager<Networks extends Multichain.MultiChainNetworks> {
  private activeNetwork: Networks
  private providerManager: ProviderManager<Networks>
  private networkSwitch: EventEmitter

  constructor(
    networkConfigurations: Partial<
      Record<Networks, Multichain.MultichainProviderConfig>
    >,
    defaultNetwork: Networks = Mina.Networks.MAINNET as Networks
  ) {
    this.activeNetwork = defaultNetwork
    this.networkSwitch = new EventEmitter()

    // Create a ProviderManager instance for managing providers
    this.providerManager = new ProviderManager<Networks>(
      networkConfigurations as Record<
        Networks,
        Multichain.MultichainProviderConfig
      >
    )
  }

  public switchNetwork(network: Networks): void {
    if (this.activeNetwork !== network) {
      this.activeNetwork = network
      this.networkSwitch.emit('networkChanged', network)
    }
  }

  public onNetworkChanged(listener: (network: Networks) => void): void {
    this.networkSwitch.on('networkChanged', listener)
  }

  public offNetworkChanged(listener: (network: Networks) => void): void {
    this.networkSwitch.removeListener('networkChanged', listener)
  }

  public getActiveProvider(): Multichain.MultiChainProvider | null {
    return this.providerManager.getProvider(this.activeNetwork)
  }

  public getAvailableNetworks(): Networks[] {
    // Note: Object.keys doesn't ensure type safety. We're assuming every key in providerManager.providers is a valid network.
    return Object.keys(this.providerManager['providers']) as Networks[]
  }

  public getCurrentNetwork(): Networks {
    return this.activeNetwork
  }
}

export { NetworkManager }
