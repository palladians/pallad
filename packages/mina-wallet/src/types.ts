import {
  ChainSignablePayload,
  ChainSignatureResult,
  ChainSpecificArgs,
  ChainSpecificPayload,
  FromBip39MnemonicWordsProps,
  GroupedCredentials
} from '@palladxyz/key-management'
import {
  AccountInfo,
  Mina,
  SubmitTxArgs,
  SubmitTxResult
} from '@palladxyz/mina-core'

//import { PublicCredential } from '@palladxyz/vault'

export interface MinaWallet {
  readonly balance: number

  //getName(): Promise<string>
  createWallet(strength: number): Promise<{ mnemonic: string[] } | null>

  restoreWallet<T extends ChainSpecificPayload>(
    payload: T,
    args: ChainSpecificArgs,
    { mnemonicWords, getPassphrase }: FromBip39MnemonicWordsProps
  ): Promise<void>

  getCurrentWallet(): GroupedCredentials | null
  getCredentials(): GroupedCredentials[] | null

  getAccountInfo(publicKey: Mina.PublicKey): Promise<AccountInfo | null>

  getTransactions(
    publicKey: Mina.PublicKey
  ): Promise<Mina.TransactionBody[] | null>

  constructTx(
    transaction: Mina.TransactionBody,
    kind: Mina.TransactionKind
  ): Promise<Mina.ConstructedTransaction>

  sign(
    signable: ChainSignablePayload
  ): Promise<ChainSignatureResult | undefined>

  submitTx(submitTxArgs: SubmitTxArgs): Promise<SubmitTxResult>

  // The wallet might need APIs for receiving challenges and completing them!
  // Challenge(challenge: VerifiableCredentialChallenge): Promise<VerifiableCredentialChallengeResponse>

  shutdown(): void
}
