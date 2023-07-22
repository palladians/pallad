import {
  ChainSpecificArgs,
  ChainSpecificPayload_,
  FromBip39MnemonicWordsProps,
  GroupedCredentials
} from '@palladxyz/key-management-agnostic'
import {
  AccountInfo,
  Mina,
  SubmitTxArgs,
  SubmitTxResult
} from '@palladxyz/mina-core'

//import { PublicCredential } from '@palladxyz/vault'

export interface MinaWallet {
  readonly balance: number

  /*getName(): Promise<string>

  createWallet(
    walletName: string,
    accountNumber: number
  ): Promise<{ publicKey: string; mnemonic: string } | null>*/

  restoreWallet<T extends ChainSpecificPayload_>(
    payload: T,
    args: ChainSpecificArgs,
    { mnemonicWords, getPassphrase }: FromBip39MnemonicWordsProps
  ): Promise<void>

  getCurrentWallet(): GroupedCredentials | null
  getCredentials(): GroupedCredentials[] | null

  getAccountInfo(publicKey: Mina.PublicKey): Promise<AccountInfo | null>

  getTransactions(publicKey: Mina.PublicKey): Promise<Mina.TransactionBody[] | null>

  constructTx(
    transaction: Mina.TransactionBody,
    kind: Mina.TransactionKind
  ): Promise<Mina.ConstructedTransaction>

  submitTx(submitTxArgs: SubmitTxArgs): Promise<SubmitTxResult>

  shutdown(): void
}
