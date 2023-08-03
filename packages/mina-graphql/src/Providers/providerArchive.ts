import {
  Mina,
  TransactionsByAddressesArgs,
  TransactionsByIdsArgs
} from '@palladxyz/mina-core'

import { ChainHistoryGraphQLProvider } from './ChainHistory'
import { ProviderArchive } from './types'
import { EventEmitter } from 'events'

export class MinaArchiveProvider implements ProviderArchive {
  private chainHistoryProvider: ChainHistoryGraphQLProvider
  public providerUrl: string
  private emitter: EventEmitter

  constructor(archiveUrl: string) {
    this.chainHistoryProvider = new ChainHistoryGraphQLProvider(archiveUrl)
    this.providerUrl = archiveUrl
    this.emitter = new EventEmitter()
  }

  public onNetworkChanged(listener: (nodeUrl: string) => void) {
    this.emitter.removeAllListeners('networkChanged');
    this.emitter.on('networkChanged', listener)
  }

  public get provider(): this {
    return this
  }

  public async changeNetwork(nodeUrl: string): Promise<void> {
    await this.chainHistoryProvider.changeNetwork(nodeUrl)
    this.providerUrl = nodeUrl

    this.emitter.emit('networkChanged', nodeUrl)
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
