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
import { Multichain } from '@palladxyz/multi-chain-core'
import {
  KeyAgentName,
  KeyAgents,
  SearchQuery,
  SingleCredentialState,
  StoredCredential
} from '@palladxyz/vault'
export interface MinaWallet {
  readonly balance: number

  //getName(): Promise<string>
  createWallet(strength: number): Promise<{ mnemonic: string[] } | null>

  restoreWallet<T extends ChainSpecificPayload>(
    payload: T,
    args: ChainSpecificArgs,
    network: Multichain.MultiChainNetworks,
    { mnemonicWords, getPassphrase }: FromBip39MnemonicWordsProps,
    keyAgentName: KeyAgentName,
    keyAgentType?: KeyAgents.InMemory
  ): Promise<void>

  getCurrentWallet(): SingleCredentialState | null

  getCredentials(query: SearchQuery): StoredCredential[]

  getAccountInfo(publicKey: Mina.PublicKey): Promise<AccountInfo | null>

  getTransactions(
    publicKey: Mina.PublicKey // Need a multichain public key type
  ): Promise<Multichain.MultiChainTransactionBody[] | null>

  constructTx( // should leave this as mina only for now
    transaction: Mina.TransactionBody,
    kind: Mina.TransactionKind
  ): Promise<Mina.ConstructedTransaction>

  sign(
    signable: ChainSignablePayload
  ): Promise<ChainSignatureResult | undefined>

  submitTx(submitTxArgs: SubmitTxArgs): Promise<SubmitTxResult | undefined>

  switchNetwork(network: Multichain.MultiChainNetworks): Promise<void>
  getCurrentNetwork(): Multichain.MultiChainNetworks | null

  shutdown(): void
}
