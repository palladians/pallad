import {
  Mina,
  TransactionsByAddressesArgs,
  TransactionsByIdsArgs
} from '@palladxyz/mina-core'
import { EventEmitter } from 'events'

import { ChainHistoryGraphQLProvider } from './ChainHistory'
import { ProviderArchive } from './types'

export class MinaArchiveProvider implements ProviderArchive {
  private chainHistoryProvider: ChainHistoryGraphQLProvider | null
  public providerUrl: string
  private emitter: EventEmitter

  constructor(archiveUrl: string) {
    this.chainHistoryProvider = new ChainHistoryGraphQLProvider(archiveUrl)
    this.providerUrl = archiveUrl
    this.emitter = new EventEmitter()
  }

  public onNetworkChanged(listener: (nodeUrl: string) => void) {
    this.emitter.removeAllListeners('networkChanged')
    this.emitter.on('networkChanged', listener)
  }

  public get provider(): this {
    return this
  }

  public async changeNetwork(nodeUrl: string): Promise<void> {
    await this.chainHistoryProvider?.changeNetwork(nodeUrl)
    this.providerUrl = nodeUrl

    this.emitter.emit('networkChanged', nodeUrl)
  }

  public async destroy(): Promise<void> {
    await this.chainHistoryProvider?.destroy()

    // Remove all listeners to avoid memory leaks
    this.emitter.removeAllListeners()

    // Nullify or reinitialize the properties, as per the requirements of your application
    this.chainHistoryProvider = null
    this.emitter = new EventEmitter()
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
