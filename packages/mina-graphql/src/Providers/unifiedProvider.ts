import {
  AccountInfo,
  AccountInfoArgs,
  Mina,
  SubmitTxArgs,
  SubmitTxResult,
  TransactionsByAddressesArgs,
  TransactionsByIdsArgs,
  TxStatus,
  TxStatusArgs,
  UnifiedMinaProviderConfig
} from '@palladxyz/mina-core'
import { EventEmitter } from 'events'

import { MinaProvider } from './provider'
import { MinaArchiveProvider } from './providerArchive'
import { ProviderArchive, ProviderNode } from './types'

export class UnifiedMinaProvider implements ProviderNode, ProviderArchive {
  private nodeProvider: MinaProvider
  private archiveProvider: MinaArchiveProvider
  private emitter: EventEmitter

  constructor(config: UnifiedMinaProviderConfig) {
    this.nodeProvider = new MinaProvider(config.nodeUrl)
    this.archiveProvider = new MinaArchiveProvider(config.archiveUrl)
    this.emitter = new EventEmitter()

    this.nodeProvider.onNetworkChanged((url) =>
      this.emitter.emit('networkChanged', url)
    )
    this.archiveProvider.onNetworkChanged((url) =>
      this.emitter.emit('networkChanged', url)
    )
  }

  public onNetworkChanged(listener: (url: string) => void) {
    this.emitter.removeAllListeners('networkChanged')
    this.emitter.on('networkChanged', listener)
  }

  public get provider(): this {
    return this
  }

  public async changeNetwork(
    nodeUrl: string,
    archiveUrl: string
  ): Promise<void> {
    await this.nodeProvider.changeNetwork(nodeUrl)
    await this.archiveProvider.changeNetwork(archiveUrl)
  }

  public async destroy(): Promise<void> {
    await this.nodeProvider.destroy()
    await this.archiveProvider.destroy()
    this.emitter.removeAllListeners()
  }

  // Methods related to MinaProvider
  public async getAccountInfo(
    args: AccountInfoArgs
  ): Promise<AccountInfo | undefined> {
    return this.nodeProvider.getAccountInfo(args)
  }

  public async getTransactionStatus(
    args: TxStatusArgs
  ): Promise<TxStatus | undefined> {
    return this.nodeProvider.getTransactionStatus(args)
  }

  public async submitTransaction(
    args: SubmitTxArgs
  ): Promise<SubmitTxResult | undefined> {
    return this.nodeProvider.submitTransaction(args)
  }

  // Methods related to MinaArchiveProvider
  public async getTransactions(
    args: TransactionsByAddressesArgs
  ): Promise<Mina.Paginated<Mina.TransactionBody> | undefined> {
    return this.archiveProvider.getTransactions(args)
  }

  public async getTransaction(
    args: TransactionsByIdsArgs
  ): Promise<Mina.TransactionBody[] | undefined> {
    return this.archiveProvider.getTransaction(args)
  }
}
