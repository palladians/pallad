import { AccountInfo, Mina } from '@palladxyz/mina-core'
import {
  ConstructedTransaction,
  SignedTransaction
} from '@palladxyz/tx-construction'

export interface MinaWallet {
  getAccountInfo(publicKey: Mina.PublicKey): Promise<AccountInfo>

  getTransactions(publicKey: Mina.PublicKey): Promise<Mina.TransactionBody[]>

  constructTx(
    transaction: Mina.TransactionBody,
    kind: Mina.TransactionKind
  ): Promise<ConstructedTransaction>

  signTx(
    privateKey: string,
    transaction: ConstructedTransaction
  ): Promise<SignedTransaction>

  // Uncomment when you implement submitTx in your MinaWalletImpl class
  // submitTx(signedTransaction: SignedTransaction): Promise<SubmitTxResult>

  shutdown(): void
}
