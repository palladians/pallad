import { Network } from '@palladxyz/key-generator'
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
  createWallet(
    walletName: string,
    network: Network,
    accountNumber: number
  ): Promise<{ publicKey: string; mnemonic: string } | null>

  restoreWallet(
    walletName: string,
    network: Network,
    mnemonic: string,
    accountNumber: number
  ): Promise<{ publicKey: string } | null>

  getCurrentWallet(): PublicCredential | null

  getAccounts(): string[]

  getAccountInfo(publicKey: Mina.PublicKey): Promise<AccountInfo>

  getTransactions(publicKey: Mina.PublicKey): Promise<Mina.TransactionBody[]>

  constructTx(
    transaction: Mina.TransactionBody,
    kind: Mina.TransactionKind
  ): Promise<ConstructedTransaction>

  signTx(
    walletPublicKey: string,
    transaction: ConstructedTransaction,
    password: string
  ): Promise<SignedTransaction>

  submitTx(submitTxArgs: SubmitTxArgs): Promise<SubmitTxResult>

  shutdown(): void
}
