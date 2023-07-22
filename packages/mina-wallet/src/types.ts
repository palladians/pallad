import {
  ChainSpecificArgs,
  ChainSpecificPayload_,
  FromBip39MnemonicWordsProps
} from '@palladxyz/key-management-agnostic'
import {
  AccountInfo,
  Mina,
  SubmitTxArgs,
  SubmitTxResult
  // SubmitTxArgs,
  // SubmitTxResult
} from '@palladxyz/mina-core'

//import { PublicCredential } from '@palladxyz/vault'

export interface MinaWallet {
  readonly balance: number

  /*getName(): Promise<string>

  createWallet(
    walletName: string,
    accountNumber: number
  ): Promise<{ publicKey: string; mnemonic: string } | null>*/

  /**
   *
   * @param payload Chain specific payload is a class object that methods capable of performing various operations (like deriving credentials) can use to derive credentials
   * @param args Chain specific args defining which credentials to derive
   * @param param2 mnemonic words and getPassphrase function
   */
  restoreWallet<T extends ChainSpecificPayload_>(
    payload: T,
    args: ChainSpecificArgs,
    { mnemonicWords, getPassphrase }: FromBip39MnemonicWordsProps
  ): Promise<void>

  //getCurrentWallet(): PublicCredential | null

  //getAccounts(): string[]

  getAccountInfo(publicKey: Mina.PublicKey): Promise<AccountInfo>
  setAccountInfo(accountInfo: AccountInfo): void

  getTransactions(publicKey: Mina.PublicKey): Promise<Mina.TransactionBody[]>

  constructTx(
    transaction: Mina.TransactionBody,
    kind: Mina.TransactionKind
  ): Promise<Mina.ConstructedTransaction>

  submitTx(submitTxArgs: SubmitTxArgs): Promise<SubmitTxResult>

  shutdown(): void
}
