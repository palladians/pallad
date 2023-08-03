import {
  AccountInfo,
  AccountInfoArgs,
  SubmitTxArgs,
  SubmitTxResult,
  TxStatus,
  TxStatusArgs
} from '@palladxyz/mina-core'

import { AccountInfoGraphQLProvider } from './AccountInfo'
import { TxStatusGraphQLProvider } from './TxStatus'
import { TxSubmitGraphQLProvider } from './TxSubmit'
import { ProviderNode } from './types'
import { EventEmitter } from 'events'

export class MinaProvider implements ProviderNode {
  private accountInfoProvider: AccountInfoGraphQLProvider
  private txSubmitProvider: TxSubmitGraphQLProvider
  private txStatusProvider: TxStatusGraphQLProvider
  private emitter: EventEmitter
  public providerUrl: string

  constructor(nodeUrl: string) {
    this.accountInfoProvider = new AccountInfoGraphQLProvider(nodeUrl)
    this.txSubmitProvider = new TxSubmitGraphQLProvider(nodeUrl)
    this.txStatusProvider = new TxStatusGraphQLProvider(nodeUrl)
    this.emitter = new EventEmitter()
    this.providerUrl = nodeUrl
  }

  public onNetworkChanged(listener: (nodeUrl: string) => void) {
    this.emitter.removeAllListeners('networkChanged');
    this.emitter.on('networkChanged', listener)
  }

  public get provider(): this {
    return this
  }

  public async changeNetwork(nodeUrl: string): Promise<void> {
    await this.accountInfoProvider.changeNetwork(nodeUrl)
    await this.txSubmitProvider.changeNetwork(nodeUrl)
    await this.txStatusProvider.changeNetwork(nodeUrl)
    this.providerUrl = nodeUrl

    this.emitter.emit('networkChanged', nodeUrl)
  }

  public async destroy(): Promise<void> {
    // Here you should destroy resources based on your providers.
    throw new Error('Method not implemented.')
  }

  public async getAccountInfo(args: AccountInfoArgs): Promise<AccountInfo> {
    return this.accountInfoProvider.getAccountInfo(args)
  }

  public async getTransactionStatus(args: TxStatusArgs): Promise<TxStatus> {
    return this.txStatusProvider.checkTxStatus(args)
  }

  public async submitTransaction(args: SubmitTxArgs): Promise<SubmitTxResult> {
    return this.txSubmitProvider.submitTx(args)
  }
}
