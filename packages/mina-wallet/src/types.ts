import {
  AccountInfo,
  Mina,
  SubmitTxArgs,
  SubmitTxResult
} from '@palladxyz/mina-core'
import {
  ConstructedTransaction,
  SignedTransaction
} from '@palladxyz/tx-construction'
import { PublicCredential } from '@palladxyz/vault'

export interface MinaWallet {
  // TODO: where do we specify the unlock & spending password?
  createWallet(
    walletName: string,
    accountNumber: number
  ): Promise<{ publicKey: string; mnemonic: string } | null>

  restoreWallet(
    walletName: string,
    mnemonic: string,
    accountNumber: number
  ): Promise<{ publicKey: string } | null>

  getCurrentWallet(): PublicCredential | null

  //getAccounts(): string[]

  getAccountInfo(publicKey: Mina.PublicKey): Promise<AccountInfo>

  getTransactions(publicKey: Mina.PublicKey): Promise<Mina.TransactionBody[]>

  constructTx(
    transaction: Mina.TransactionBody,
    kind: Mina.TransactionKind
  ): Promise<ConstructedTransaction>

  signTx(transaction: ConstructedTransaction): Promise<SignedTransaction>

  submitTx(submitTxArgs: SubmitTxArgs): Promise<SubmitTxResult>

  shutdown(): void
}
