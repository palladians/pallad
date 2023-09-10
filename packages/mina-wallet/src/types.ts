import {
  ChainSignablePayload,
  ChainSignatureResult,
  ChainSpecificArgs,
  ChainSpecificPayload,
  FromBip39MnemonicWordsProps
} from '@palladxyz/key-management'
import {
  AccountInfo,
  Mina,
  SubmitTxArgs,
  SubmitTxResult
} from '@palladxyz/mina-core'
import {
  keyAgentName,
  keyAgents,
  SingleCredentialState
} from '@palladxyz/vaultv2'
export interface MinaWallet {
  readonly balance: number

  //getName(): Promise<string>
  createWallet(strength: number): Promise<{ mnemonic: string[] } | null>

  restoreWallet<T extends ChainSpecificPayload>(
    payload: T,
    args: ChainSpecificArgs,
    network: Mina.Networks,
    { mnemonicWords, getPassphrase }: FromBip39MnemonicWordsProps,
    keyAgentName: keyAgentName,
    keyAgentType?: keyAgents.inMemory
  ): Promise<void>

  getCurrentWallet(): SingleCredentialState | null
  //getCredentials(): GroupedCredentials[] | null

  getAccountInfo(publicKey: Mina.PublicKey): Promise<AccountInfo | null>

  getTransactions(
    publicKey: Mina.PublicKey
  ): Promise<Mina.TransactionBody[] | null>

  constructTx(
    transaction: Mina.TransactionBody,
    kind: Mina.TransactionKind
  ): Promise<Mina.ConstructedTransaction>

  sign(
    signable: ChainSignablePayload,
    keyAgentName: keyAgentName
  ): Promise<ChainSignatureResult | undefined>

  submitTx(submitTxArgs: SubmitTxArgs): Promise<SubmitTxResult | undefined>

  switchNetwork(network: Mina.Networks): Promise<void>
  getCurrentNetwork(): Mina.Networks | null

  shutdown(): void
}
