import {
  Mina,
  TransactionsByAddressesArgs,
  TransactionsByIdsArgs
} from '@palladxyz/mina-core'

import { ChainHistoryGraphQLProvider } from './chain-history'
import { ProviderArchive } from './types'

export class MinaArchiveProvider implements ProviderArchive {
  private chainHistoryProvider: ChainHistoryGraphQLProvider | null
  public providerUrl: string

  constructor(archiveUrl: string) {
    this.chainHistoryProvider = new ChainHistoryGraphQLProvider(archiveUrl)
    this.providerUrl = archiveUrl
  }

  public get provider(): this {
    return this
  }

  public async changeNetwork(nodeUrl: string): Promise<void> {
    await this.chainHistoryProvider?.changeNetwork(nodeUrl)
    this.providerUrl = nodeUrl
  }

  public async destroy(): Promise<void> {
    await this.chainHistoryProvider?.destroy()

    // Nullify or reinitialize the properties, as per the requirements of your application
    this.chainHistoryProvider = null
    this.providerUrl = ''
  }

  public async getTransactions(
    args: TransactionsByAddressesArgs
  ): Promise<Mina.Paginated<Mina.TransactionBody> | undefined> {
    return this.chainHistoryProvider?.transactionsByAddresses(args)
  }

  public async getTransaction(
    args: TransactionsByIdsArgs
  ): Promise<Mina.TransactionBody[] | undefined> {
    return this.chainHistoryProvider?.transactionsByHashes(args)
  }
}
