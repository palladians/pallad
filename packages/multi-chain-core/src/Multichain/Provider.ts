import {
  Mina,
  UnifiedMinaProviderConfig,
  UnifiedMinaProviderType
} from '@palladxyz/mina-core'
import { UnifiedMinaProvider } from '@palladxyz/mina-graphql'

import { MultiChainAccountInfo, MultiChainAccountInfoArgs } from './Account'
import { MultiChainNetworks } from './Networks'
import {
  MultiChainPaginatedTransactions,
  MultiChainSubmitTxArgs,
  MultiChainSubmitTxResult,
  MultiChainTransactionsByAddressesArgs,
  MultiChainTransactionStatus,
  MultiChainTransactionStatusArgs
} from './Transaction'

export type MultichainProviderConfig = UnifiedMinaProviderConfig

export type MultiChainProviderType = UnifiedMinaProviderType

export class MultiChainProvider {
  private specificProvider: MultiChainProviderType | null = null
  private network: MultiChainNetworks

  constructor(
    providerConfig: MultichainProviderConfig,
    network: MultiChainNetworks
  ) {
    this.network = network
    switch (network) {
      case Mina.Networks.MAINNET:
      case Mina.Networks.DEVNET:
      case Mina.Networks.BERKELEY:
      case Mina.Networks.TESTWORLD:
        // Assuming UnifiedMinaProviderType can be instantiated with providerConfig
        this.specificProvider = new UnifiedMinaProvider(providerConfig)
        break
      // Add other networks and their respective initializations as needed.
      default:
        throw new Error(
          `Unsupported network: ${network} in MultiChainProvider.`
        )
    }
  }

  public async getAccountInfo(
    args: MultiChainAccountInfoArgs
  ): Promise<MultiChainAccountInfo | undefined> {
    if (
      this.network === Mina.Networks.MAINNET ||
      this.network === Mina.Networks.DEVNET ||
      this.network === Mina.Networks.BERKELEY ||
      this.network === Mina.Networks.TESTWORLD
    ) {
      return await this.specificProvider?.getAccountInfo(args)
    }
    throw new Error('Provider not initialized in Multichain getAccountInfo.')
  }

  public async getTransactionStatus(
    args: MultiChainTransactionStatusArgs
  ): Promise<MultiChainTransactionStatus | undefined> {
    if (
      this.network === Mina.Networks.MAINNET ||
      this.network === Mina.Networks.DEVNET ||
      this.network === Mina.Networks.BERKELEY ||
      this.network === Mina.Networks.TESTWORLD
    ) {
      return await this.specificProvider?.getTransactionStatus(args)
    }
    throw new Error(
      'Provider not initialized in Multichain getTransactionStatus.'
    )
  }

  public async submitTransaction(
    args: MultiChainSubmitTxArgs
  ): Promise<MultiChainSubmitTxResult | undefined> {
    if (
      this.network === Mina.Networks.MAINNET ||
      this.network === Mina.Networks.DEVNET ||
      this.network === Mina.Networks.BERKELEY ||
      this.network === Mina.Networks.TESTWORLD
    ) {
      return await this.specificProvider?.submitTransaction(args)
    }
    throw new Error('Provider not initialized in Multichain submitTransaction.')
  }

  public async getTransactions(
    args: MultiChainTransactionsByAddressesArgs
  ): Promise<MultiChainPaginatedTransactions | undefined> {
    if (
      this.network === Mina.Networks.MAINNET ||
      this.network === Mina.Networks.DEVNET ||
      this.network === Mina.Networks.BERKELEY ||
      this.network === Mina.Networks.TESTWORLD
    ) {
      return await this.specificProvider?.getTransactions(args)
    }
    throw new Error('Provider not initialized in Multichain getTransactions.')
  }
}
