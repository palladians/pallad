import { Mina } from '@palladxyz/mina-core'
import { MinaArchiveProvider, MinaProvider } from '@palladxyz/mina-graphql'
import { EventEmitter } from 'events'

type ProviderConfiguration = {
  provider: string
  archive: string
}

type NetworkConfigurations = {
  [network in Mina.Networks]?: ProviderConfiguration
}

class NetworkManager {
  private activeNetwork: Mina.Networks
  private providers: Record<Mina.Networks, MinaProvider | null>
  private archiveProviders: Record<Mina.Networks, MinaArchiveProvider | null>
  private networkSwitch: EventEmitter

  constructor(
    networkConfigurations: NetworkConfigurations,
    defaultNetwork: Mina.Networks = Mina.Networks.MAINNET
  ) {
    this.activeNetwork = defaultNetwork
    this.networkSwitch = new EventEmitter()
    this.providers = {
      [Mina.Networks.MAINNET]: null,
      [Mina.Networks.DEVNET]: null,
      [Mina.Networks.BERKELEY]: null
    }
    this.archiveProviders = {
      [Mina.Networks.MAINNET]: null,
      [Mina.Networks.DEVNET]: null,
      [Mina.Networks.BERKELEY]: null
    }

    for (const network of Object.keys(networkConfigurations)) {
      const config = networkConfigurations[network as Mina.Networks]
      if (config) {
        this.providers[network as Mina.Networks] = new MinaProvider(
          config.provider
        )
        this.archiveProviders[network as Mina.Networks] =
          new MinaArchiveProvider(config.archive)
      }
    }
  }

  public switchNetwork(network: Mina.Networks): void {
    this.activeNetwork = network
    this.networkSwitch.emit('networkChanged', network)
  }

  public onNetworkChanged(listener: (network: Mina.Networks) => void): void {
    this.networkSwitch.removeAllListeners('networkChanged')
    this.networkSwitch.on('networkChanged', listener)
  }

  public offNetworkChanged(listener: (network: Mina.Networks) => void): void {
    this.networkSwitch.removeListener('networkChanged', listener)
  }

  public getActiveProvider(): MinaProvider | null {
    return this.providers[this.activeNetwork]
  }

  public getActiveArchiveProvider(): MinaArchiveProvider | null {
    return this.archiveProviders[this.activeNetwork]
  }

  public getAvailableNetworks(): Mina.Networks[] {
    return Object.keys(this.providers) as Mina.Networks[]
  }

  public getCurrentNetwork(): Mina.Networks {
    return this.activeNetwork
  }
  // Other utility methods or functionalities can be added as needed.
}

export { NetworkConfigurations, NetworkManager }
