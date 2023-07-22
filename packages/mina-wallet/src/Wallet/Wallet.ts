import {
  ChainSignablePayload,
  ChainSignatureResult,
  ChainSpecificArgs,
  ChainSpecificPayload_,
  constructTransaction,
  FromBip39MnemonicWordsProps,
  GroupedCredentials,
  InMemoryKeyAgent,
  Network
} from '@palladxyz/key-management-agnostic'
import {
  AccountInfo,
  AccountInfoArgs,
  Mina,
  SubmitTxArgs,
  SubmitTxResult,
  TransactionsByAddressesArgs
} from '@palladxyz/mina-core'
import { MinaProvider } from '@palladxyz/mina-graphql'
import { accountStore, keyAgentStore } from '@palladxyz/vault'

/**
 * This wallet is in the process of becoming chain agnostic
 */
import { MinaWallet } from '../types'

export interface MinaWalletDependencies {
  readonly keyAgent: InMemoryKeyAgent | null
  readonly minaProvider: MinaProvider
  readonly network: Network
  //readonly stores?: WalletStores;
}

export interface MinaWalletProps {
  readonly name: string
}

export class MinaWalletImpl implements MinaWallet {
  readonly keyAgent: InMemoryKeyAgent | null
  readonly balance: number
  readonly minaProvider: MinaProvider
  readonly name: string
  // Storage for the current wallet

  constructor(
    { name }: MinaWalletProps,
    {
      keyAgent,
      minaProvider
    }: //stores = createInMemoryWalletStores() // persistence layer?
    MinaWalletDependencies
  ) {
    this.keyAgent = keyAgent
    this.minaProvider = minaProvider
    this.name = name
    this.balance = 0
  }

  getName(): Promise<string> {
    throw new Error('Method not implemented.')
  }

  async getAccountInfo(publicKey: Mina.PublicKey): Promise<AccountInfo> {
    const accountInfoArgs: AccountInfoArgs = { publicKey: publicKey }
    const accountInfo = await this.minaProvider.getAccountInfo(accountInfoArgs)
    return accountInfo
  }

  setAccountInfo(accountInfo: AccountInfo): void {
    accountStore.getState().setAccountInfo(accountInfo)
  }

  async getTransactions(
    publicKey: Mina.PublicKey
  ): Promise<Mina.TransactionBody[]> {
    const limit = 10
    let startAt = 0
    let transactions: Mina.TransactionBody[] = []

    while (transactions.length < 20) {
      const args: TransactionsByAddressesArgs = {
        addresses: [publicKey],
        pagination: { startAt, limit }
      }

      const transactionPage = await this.minaProvider.getTransactions(args)

      transactions = [...transactions, ...transactionPage.pageResults]

      if (
        transactionPage.pageResults.length < limit ||
        transactions.length >= 20
      ) {
        break
      }

      startAt += limit
    }

    transactions = transactions.slice(0, 20)

    accountStore.getState().setTransactions(transactions)

    return transactions
  }

  async sign<T extends ChainSpecificPayload_>(
    payload: T,
    signable: ChainSignablePayload,
    args: ChainSpecificArgs
  ): Promise<ChainSignatureResult | undefined> {
    if (keyAgentStore.getState().keyAgent === undefined) {
      throw new Error('Key agent is undefined')
    }
    return await keyAgentStore
      .getState()
      .keyAgent?.sign(payload, signable, args)
  }

  // This is Mina Specific
  // TODO: Make this chain agnostic
  async constructTx(
    transaction: Mina.TransactionBody,
    kind: Mina.TransactionKind
  ): Promise<Mina.ConstructedTransaction> {
    const constructedTransaction: Mina.ConstructedTransaction =
      constructTransaction(transaction, kind)
    return constructedTransaction
  }
  // This is Mina Specific
  // TODO: Make this chain agnostic
  async submitTx(submitTxArgs: SubmitTxArgs): Promise<SubmitTxResult> {
    const result = await this.minaProvider.submitTransaction(submitTxArgs)
    return result
  }

  /*

  async createWallet(
    walletName: string,
    accountNumber: number
  ): Promise<{ publicKey: string; mnemonic: string } | null> {
    // Create a new wallet
    const result = await keyAgentStore.getState().createWallet({
      walletName,
      network: this.network,
      accountNumber
    })

    // Return the public key and mnemonic or null
    return result
      ? { publicKey: result.publicKey, mnemonic: result.mnemonic }
      : null
  }*/

  async restoreWallet<T extends ChainSpecificPayload_>(
    payload: T,
    args: ChainSpecificArgs,
    { mnemonicWords, getPassphrase }: FromBip39MnemonicWordsProps
  ): Promise<void> {
    // Restore a wallet from a mnemonic
    const agentArgs: FromBip39MnemonicWordsProps = {
      getPassphrase: getPassphrase,
      mnemonicWords: mnemonicWords,
      mnemonic2ndFactorPassphrase: ''
    }
    // restore the agent state
    await keyAgentStore.getState().restoreWallet(payload, args, agentArgs)
  }

  getCurrentWallet(): GroupedCredentials | null {
    // Get the current wallet
    const result = keyAgentStore.getState().getCurrentWallet()

    // Return the public credential or null
    return result ? result : null
  }

  getCredentials(): string[] {
    // Get the list of accounts for the current wallet
    const result = keyAgentStore.getState().getCredentials()

    // Return the list of accounts
    return result
  }

  shutdown(): void {
    // Implement the logic to shut down the wallet
  }
}
