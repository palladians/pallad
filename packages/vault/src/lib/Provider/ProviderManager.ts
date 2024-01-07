import { Multichain } from '@palladxyz/multi-chain-core'

export const providerFactory = (
  config: Multichain.MultichainProviderConfig,
  network: Multichain.MultiChainNetworks
): Multichain.MultiChainProvider => {
  // Your logic to create a provider instance based on config
  return new Multichain.MultiChainProvider(config, network)
}

export type ProvidersConfig = Partial<
  Record<Multichain.MultiChainNetworks, Multichain.MultichainProviderConfig>
>

/**
 * ProviderManager manages the MinaProvider and MinaArchiveProvider instances
 * for different networks.
 */
export class ProviderManager<Networks extends Multichain.MultiChainNetworks> {
  // should change this to `multichainProvider`
  private providers: Partial<
    Record<Networks, Multichain.MultiChainProvider | null>
  > = {} as Partial<
    Record<Multichain.MultiChainNetworks, Multichain.MultiChainProvider | null>
  >
  public availableChainIds: string[] = []

  /**
   * Creates a new instance of ProviderManager.
   * @param providersConfig - An object with provider configurations for each network.
   * @param providerFactory - Function to create a provider instance from a configuration.
   */
  constructor(
    providersConfig: ProvidersConfig //Partial<Record<Networks, Multichain.MultichainProviderConfig>>,
  ) {
    for (const network in providersConfig) {
      if (providersConfig[network as Networks]) {
        this.providers[network as Networks] = this.providerFactory(
          providersConfig[network as Networks]!,
          network as Networks
        )
      }
    }
  }

  async refreshChainIds() {
    for (const network in this.providers) {
      const provider = this.providers[network as Networks]
      this.availableChainIds.push((await provider?.getChainId()) || '')
    }
  }

  /**
   * Get the available chain ids.
   * @returns The available chain ids.
   */

  getAvailableChainIds(): string[] {
    return this.availableChainIds
  }

  /**
   * Get the Provider for a given network.
   * @param network - The target network.
   * @returns The Provider for the specified network.
   */
  getProvider(network: Networks): Multichain.MultiChainProvider | null {
    return this.providers[network] || null
  }

  /**
   * Provider factory function.
   */
  private providerFactory = providerFactory
}
