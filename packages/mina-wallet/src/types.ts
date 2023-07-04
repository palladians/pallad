import { AccountInfo, Mina } from '@palladxyz/mina-core'
//import { SignedTransaction } from '@palladxyz/tx-construction';
//import { SubmitTxResult } from "@palladxyz/mina-core"

export interface MinaWallet {
  getAccountInfo(publicKey: Mina.PublicKey): Promise<AccountInfo>
  //transactions: Promise<Mina.TransactionBody[]>;

  //createTx(transaction: TransactionBody, privateKey: string): Promise<SignedTransaction>;
  //submitTx(signedTransaction: SignedTransaction): Promise<SubmitTxResult>;
  shutdown(): void
}
