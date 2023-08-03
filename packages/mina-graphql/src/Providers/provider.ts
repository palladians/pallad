import {
  AccountInfo,
  AccountInfoArgs,
  SubmitTxArgs,
  SubmitTxResult,
  TxStatus,
  TxStatusArgs
} from '@palladxyz/mina-core'
import { EventEmitter } from 'events'

import { AccountInfoGraphQLProvider } from './AccountInfo'
import { TxStatusGraphQLProvider } from './TxStatus'
import { TxSubmitGraphQLProvider } from './TxSubmit'
import { ProviderNode } from './types'

export class MinaProvider implements ProviderNode {
  private accountInfoProvider: AccountInfoGraphQLProvider | null
  private txSubmitProvider: TxSubmitGraphQLProvider | null
  private txStatusProvider: TxStatusGraphQLProvider | null
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
    this.emitter.removeAllListeners('networkChanged')
    this.emitter.on('networkChanged', listener)
  }

  public get provider(): this {
    return this
  }

  public async changeNetwork(nodeUrl: string): Promise<void> {
    await this.accountInfoProvider?.changeNetwork(nodeUrl)
    await this.txSubmitProvider?.changeNetwork(nodeUrl)
    await this.txStatusProvider?.changeNetwork(nodeUrl)
    this.providerUrl = nodeUrl

    this.emitter.emit('networkChanged', nodeUrl)
  }

  public async destroy(): Promise<void> {
    await this.accountInfoProvider?.destroy();
    await this.txSubmitProvider?.destroy();
    await this.txStatusProvider?.destroy();
  
    // Remove all listeners to avoid memory leaks
    this.emitter.removeAllListeners();
  
    // Nullify or reinitialize the properties, as per the requirements of your application
    this.accountInfoProvider = null;
    this.txSubmitProvider = null;
    this.txStatusProvider = null;
    this.emitter = new EventEmitter();
    this.providerUrl = "";
  }

  public async getAccountInfo(args: AccountInfoArgs): Promise<AccountInfo | undefined > {
    return this.accountInfoProvider?.getAccountInfo(args)
  }

  public async getTransactionStatus(args: TxStatusArgs): Promise<TxStatus | undefined > {
    return this.txStatusProvider?.checkTxStatus(args)
  }

  public async submitTransaction(args: SubmitTxArgs): Promise<SubmitTxResult | undefined > {
    return this.txSubmitProvider?.submitTx(args)
  }
}
