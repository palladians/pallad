import {
  FromBip39MnemonicWordsProps,
  GroupedCredentials,
  InMemoryKeyAgent
} from '@palladxyz/key-management'
import {
  AccountInfo,
  Mina
  // SubmitTxArgs,
  // SubmitTxResult
} from '@palladxyz/mina-core'
import { NetworkArgs } from '@palladxyz/vault'

//import { PublicCredential } from '@palladxyz/vault'

export interface MinaWallet {
  readonly credentials: GroupedCredentials[]
  readonly balance: number

  /*getName(): Promise<string>

  createWallet(
    walletName: string,
    accountNumber: number
  ): Promise<{ publicKey: string; mnemonic: string } | null>*/

  restoreWallet(
    { mnemonicWords, getPassphrase }: FromBip39MnemonicWordsProps,
    { network, networkType }: NetworkArgs
  ): Promise<InMemoryKeyAgent | null>

  //getCurrentWallet(): PublicCredential | null

  //getAccounts(): string[]

  getAccountInfo(publicKey: Mina.PublicKey): Promise<AccountInfo>
  setAccountInfo(accountInfo: AccountInfo): void

  getTransactions(publicKey: Mina.PublicKey): Promise<Mina.TransactionBody[]>

  /*constructTx(
    transaction: Mina.TransactionBody,
    kind: Mina.TransactionKind
  ): Promise<ConstructedTransaction>

  signTx(transaction: ConstructedTransaction): Promise<SignedTransaction>

  submitTx(submitTxArgs: SubmitTxArgs): Promise<SubmitTxResult>*/

  shutdown(): void
}
