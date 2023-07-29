import {
  Mina,
  TransactionsByAddressesArgs,
  TransactionsByIdsArgs
} from '@palladxyz/mina-core'

import { ChainHistoryGraphQLProvider } from './ChainHistory'
import { ProviderArchive } from './types'

export class MinaArchiveProvider implements ProviderArchive {
  private chainHistoryProvider: ChainHistoryGraphQLProvider

  constructor(archiveUrl: string) {
    this.chainHistoryProvider = new ChainHistoryGraphQLProvider(archiveUrl)
  }

  public get provider(): this {
    return this
  }

  public async destroy(): Promise<void> {
    // Here you should destroy resources based on your providers.
    throw new Error('Method not implemented.')
  }

  public async getTransactions(
    args: TransactionsByAddressesArgs
  ): Promise<Mina.Paginated<Mina.TransactionBody>> {
    return this.chainHistoryProvider.transactionsByAddresses(args)
  }

  public async getTransaction(
    args: TransactionsByIdsArgs
  ): Promise<Mina.TransactionBody[]> {
    return this.chainHistoryProvider.transactionsByHashes(args)
  }
}
