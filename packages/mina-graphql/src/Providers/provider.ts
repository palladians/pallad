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

export class MinaProvider implements ProviderNode {
  private accountInfoProvider: AccountInfoGraphQLProvider
  private txSubmitProvider: TxSubmitGraphQLProvider
  private txStatusProvider: TxStatusGraphQLProvider

  constructor(nodeUrl: string) {
    this.accountInfoProvider = new AccountInfoGraphQLProvider(nodeUrl)
    this.txSubmitProvider = new TxSubmitGraphQLProvider(nodeUrl)
    this.txStatusProvider = new TxStatusGraphQLProvider(nodeUrl)
  }

  public get provider(): this {
    return this
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
