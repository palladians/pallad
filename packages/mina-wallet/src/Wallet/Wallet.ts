import {
  ChainSignablePayload,
  ChainSignatureResult,
  ChainSpecificArgs,
  ChainSpecificPayload,
  constructTransaction,
  FromBip39MnemonicWordsProps,
  generateMnemonicWords,
  GroupedCredentials,
  InMemoryKeyAgent,
  MinaPayload,
  MinaSpecificArgs,
  Network
} from '@palladxyz/key-management'
import {
  AccountInfo,
  Mina,
  SubmitTxArgs,
  SubmitTxResult
} from '@palladxyz/mina-core'
import { MinaArchiveProvider, MinaProvider } from '@palladxyz/mina-graphql'
import { keyAgentStore } from '@palladxyz/vault'

/**
 * This wallet is in the process of becoming chain agnostic
 */
import { MinaWallet } from '../types'

export interface MinaWalletDependencies {
  readonly keyAgent: InMemoryKeyAgent | null
  readonly minaProvider: MinaProvider
  readonly minaArchiveProvider: MinaArchiveProvider
  readonly network: Network
  //readonly stores?: WalletStores;
}

export interface MinaWalletProps {
  readonly name: string
}

export class MinaWalletImpl implements MinaWallet {
  readonly keyAgent: InMemoryKeyAgent | null
  readonly balance: number
  private minaProvider: MinaProvider
  private minaArchiveProvider: MinaArchiveProvider
  readonly name: string
  // Storage for the current wallet

  constructor(
    { name }: MinaWalletProps,
    { keyAgent, minaProvider, minaArchiveProvider }: MinaWalletDependencies
  ) {
    this.keyAgent = keyAgent
    this.minaProvider = minaProvider
    this.minaArchiveProvider = minaArchiveProvider
    this.name = name
    this.balance = 0
  }

  getName(): string {
    return this.name
  }

  async getAccountInfo(): Promise<AccountInfo | null> {
    const currentWallet = this.getCurrentWallet()
    if (currentWallet === null) {
      throw new Error('Current wallet is null, empty or undefined')
    }
    const walletAddress = currentWallet.address
    const currentNetwork = this.getCurrentNetwork()
    if (currentNetwork === null) {
      throw new Error('Current network is null, empty or undefined')
    }
    const accountInformation =
      keyAgentStore.getState().getAccountStore(currentNetwork, walletAddress)
        ?.accountInfo || null

    return accountInformation
  }

  async getTransactions(): Promise<Mina.TransactionBody[] | null> {
    const currentWallet = this.getCurrentWallet()
    if (currentWallet === null) {
      throw new Error('Current wallet is null, empty or undefined')
    }
    const walletAddress = currentWallet.address
    const currentNetwork = this.getCurrentNetwork()
    if (currentNetwork === null) {
      throw new Error('Current network is null, empty or undefined')
    }
    const transactions =
      keyAgentStore.getState().getAccountStore(currentNetwork, walletAddress)
        ?.transactions || null

    return transactions
  }

  async sign(
    signable: ChainSignablePayload
  ): Promise<ChainSignatureResult | undefined> {
    // use current wallet to sign
    const currentWallet = this.getCurrentWallet()
    if (currentWallet === null) {
      throw new Error('Current wallet is null, empty or undefined')
    }
    // currently only Mina specific
    const args: MinaSpecificArgs = {
      network: currentWallet?.chain as Network.Mina,
      accountIndex: currentWallet?.accountIndex,
      addressIndex: currentWallet?.addressIndex,
      networkType: 'testnet'
    }
    const payload: ChainSpecificPayload = new MinaPayload()

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

  async createWallet(strength = 128): Promise<{ mnemonic: string[] } | null> {
    return { mnemonic: generateMnemonicWords(strength) }
  }
  async restoreWallet<T extends ChainSpecificPayload>(
    payload: T,
    args: ChainSpecificArgs,
    network: Mina.Networks,
    { mnemonicWords, getPassphrase }: FromBip39MnemonicWordsProps
  ): Promise<void> {
    // Restore a wallet from a mnemonic
    const agentArgs: FromBip39MnemonicWordsProps = {
      getPassphrase: getPassphrase,
      mnemonicWords: mnemonicWords,
      mnemonic2ndFactorPassphrase: ''
    }
    // restore the agent state
    await keyAgentStore
      .getState()
      .restoreWallet(
        payload,
        args,
        this.minaProvider,
        this.minaArchiveProvider,
        network,
        agentArgs
      )
    // set the current wallet
    const derivedAddress = keyAgentStore
      .getState()
      .getCredentials()?.[0]?.address
    if (derivedAddress === undefined) {
      throw new Error('Derived address is undefined')
    }
    keyAgentStore.getState().setCurrentWallet(derivedAddress)
  }

  getCurrentWallet(): GroupedCredentials | null {
    // Get the current wallet
    const result = keyAgentStore.getState().getCurrentWallet()

    // Return the public credential or null
    return result ? result : null
  }

  getCredentials(): GroupedCredentials[] | null {
    // Get the list of accounts for the current wallet
    const result = keyAgentStore.getState().getCredentials()

    // Return the list of accounts
    return result
  }

  async switchNetwork(
    network: Mina.Networks,
    nodeUrl: string,
    nodeArchiveUrl: string
  ): Promise<void> {
    // Switch the network
    await this.setCurrentNetwork(network, nodeUrl, nodeArchiveUrl)
  }

  getCurrentNetwork(): Mina.Networks | null {
    // Get the current network
    const result = keyAgentStore.getState().getCurrentNetwork()
    return result ? result : null
  }

  async setCurrentNetwork(
    network: Mina.Networks,
    nodeUrl: string,
    nodeArchiveUrl: string
  ): Promise<void> {
    // Change the providers
    this.minaProvider = new MinaProvider(nodeUrl)
    this.minaArchiveProvider = new MinaArchiveProvider(nodeArchiveUrl)
    // Set the current network
    await keyAgentStore
      .getState()
      .setCurrentNetwork(network, this.minaProvider, this.minaArchiveProvider)
  }

  shutdown(): void {
    // Implement the logic to shut down the wallet
  }
}
