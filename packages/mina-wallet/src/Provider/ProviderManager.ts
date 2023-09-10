import { Mina } from '@palladxyz/mina-core'
import { MinaArchiveProvider, MinaProvider } from '@palladxyz/mina-graphql'

/**
 * ProviderManager manages the MinaProvider and MinaArchiveProvider instances
 * for different networks.
 */
export class ProviderManager {
  private minaProviders: Record<Mina.Networks, MinaProvider | null>
  private minaArchiveProviders: Record<
    Mina.Networks,
    MinaArchiveProvider | null
  >

  /**
   * Creates a new instance of ProviderManager.
   * @param providers - An object with provider and archive URLs for each network.
   */
  constructor(providers: {
    [network in Mina.Networks]?: { provider: string; archive: string }
  }) {
    this.minaProviders = {
      [Mina.Networks.MAINNET]: null,
      [Mina.Networks.DEVNET]: null,
      [Mina.Networks.BERKELEY]: null
    }

    this.minaArchiveProviders = {
      [Mina.Networks.MAINNET]: null,
      [Mina.Networks.DEVNET]: null,
      [Mina.Networks.BERKELEY]: null
    }

    // Create providers for each network
    for (const networkKey of Object.keys(providers)) {
      const network = networkKey as Mina.Networks
      if (providers[network]) {
        this.minaProviders[network] = new MinaProvider(
          providers[network]?.provider as string
        )
        this.minaArchiveProviders[network] = new MinaArchiveProvider(
          providers[network]?.archive as string
        )
      }
    }
  }

  /**
   * Get the MinaProvider for a given network.
   * @param network - The target network.
   * @returns The MinaProvider for the specified network.
   */
  getProvider(network: Mina.Networks): MinaProvider | null {
    return this.minaProviders[network]
  }

  /**
   * Get the MinaArchiveProvider for a given network.
   * @param network - The target network.
   * @returns The MinaArchiveProvider for the specified network.
   */
  getArchiveProvider(network: Mina.Networks): MinaArchiveProvider | null {
    return this.minaArchiveProviders[network]
  }
}
