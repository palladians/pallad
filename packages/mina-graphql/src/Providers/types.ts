import {
  AccountInfo,
  AccountInfoArgs,
  Mina,
  SubmitTxArgs,
  SubmitTxResult,
  TransactionsByAddressesArgs,
  TransactionsByIdsArgs,
  TxStatus,
  TxStatusArgs
} from '@palladxyz/mina-core'

export interface Provider {
  /**
   * The provider itself
   */
  provider: this

  /**
   *  Shutdown any resources this provider is using. No additional
   *  calls should be made to this provider after calling this.
   */
  destroy(): void

  // TO DO: add methods that are familiar to ethers.js users
  // getBalance(address: AddressLike, blockTag?: BlockTag): Promise<bigint>;
  // getTransactionCount(address: AddressLike, blockTag?: BlockTag): Promise<number>;
  // getBlock(blockHashOrBlockTag: BlockTag | string, prefetchTxs?: boolean): Promise<null | Block>;
  // getTransactionResult(hash: string): Promise<null | string>;

  getAccountInfo(args: AccountInfoArgs): Promise<AccountInfo>

  getTransactions(
    args: TransactionsByAddressesArgs
  ): Promise<Mina.Paginated<Mina.TransactionBody>>

  getTransactionStatus(args: TxStatusArgs): Promise<TxStatus>

  getTransaction(args: TransactionsByIdsArgs): Promise<Mina.TransactionBody[]>

  submitTransaction(args: SubmitTxArgs): Promise<SubmitTxResult>
}
