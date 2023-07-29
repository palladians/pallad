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
/**
 * An interface that abstracts over Mina node queries.
 */
export interface ProviderNode {
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

  getTransactionStatus(args: TxStatusArgs): Promise<TxStatus>

  submitTransaction(args: SubmitTxArgs): Promise<SubmitTxResult>
}

/**
 * An interface that abstracts over Mina Archive node queries.
 */
export interface ProviderArchive {
  /**
   * The provider itself
   */
  provider: this

  /**
   *  Shutdown any resources this provider is using. No additional
   *  calls should be made to this provider after calling this.
   */
  destroy(): void

  getTransactions(
    args: TransactionsByAddressesArgs
  ): Promise<Mina.Paginated<Mina.TransactionBody>>

  getTransaction(args: TransactionsByIdsArgs): Promise<Mina.TransactionBody[]>

}
