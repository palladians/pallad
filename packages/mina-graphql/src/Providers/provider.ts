import {
  AccountInfo,
  AccountInfoArgs,
  SubmitTxArgs,
  SubmitTxResult,
  TxStatus,
  TxStatusArgs
} from '@palladxyz/mina-core'
import { HealthCheckResponse } from '@palladxyz/mina-core'

import { AccountInfoGraphQLProvider } from './AccountInfo'
import { TxStatusGraphQLProvider } from './TxStatus'
import { TxSubmitGraphQLProvider } from './TxSubmit'
import { ProviderNode } from './types'

export class MinaProvider implements ProviderNode {
  private accountInfoProvider: AccountInfoGraphQLProvider | null
  private txSubmitProvider: TxSubmitGraphQLProvider | null
  private txStatusProvider: TxStatusGraphQLProvider | null
  public providerUrl: string

  constructor(nodeUrl: string) {
    this.accountInfoProvider = new AccountInfoGraphQLProvider(nodeUrl)
    this.txSubmitProvider = new TxSubmitGraphQLProvider(nodeUrl)
    this.txStatusProvider = new TxStatusGraphQLProvider(nodeUrl)
    this.providerUrl = nodeUrl
  }

  public get provider(): this {
    return this
  }

  public async changeNetwork(nodeUrl: string): Promise<void> {
    await this.accountInfoProvider?.changeNetwork(nodeUrl)
    await this.txSubmitProvider?.changeNetwork(nodeUrl)
    await this.txStatusProvider?.changeNetwork(nodeUrl)
    this.providerUrl = nodeUrl
  }

  public async destroy(): Promise<void> {
    await this.accountInfoProvider?.destroy()
    await this.txSubmitProvider?.destroy()
    await this.txStatusProvider?.destroy()

    // Nullify or reinitialize the properties, as per the requirements of your application
    this.accountInfoProvider = null
    this.txSubmitProvider = null
    this.txStatusProvider = null
    this.providerUrl = ''
  }

  public getAccountInfo(
    args: AccountInfoArgs
  ): Promise<AccountInfo | undefined> {
    return this.accountInfoProvider!.getAccountInfo(args)
  }

  public getTransactionStatus(
    args: TxStatusArgs
  ): Promise<TxStatus | undefined> {
    return this.txStatusProvider!.checkTxStatus(args)
  }

  public submitTransaction(
    args: SubmitTxArgs
  ): Promise<SubmitTxResult | undefined> {
    return this.txSubmitProvider!.submitTx(args)
  }

  public healthCheck(): Promise<HealthCheckResponse | undefined> {
    return this.accountInfoProvider!.healthCheck()
  }
}
