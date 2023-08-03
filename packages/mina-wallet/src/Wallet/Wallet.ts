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

  private getStoreState() {
    return keyAgentStore.getState()
  }

  private setCurrentNetworkInStore(
    network: Mina.Networks,
    minaProvider: MinaProvider,
    minaArchiveProvider: MinaArchiveProvider
  ): void {
    this.getStoreState().setCurrentNetwork(
      network,
      minaProvider,
      minaArchiveProvider
    )
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
      this.getStoreState().getAccountStore(currentNetwork, walletAddress)
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
      this.getStoreState().getAccountStore(currentNetwork, walletAddress)
        ?.transactions || null

    return transactions
  }

  getKeyAgentFromStore(): InMemoryKeyAgent | null {
    return this.getStoreState().keyAgent
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

    const keyAgent = this.getKeyAgentFromStore()
    if (keyAgent === null) {
      throw new Error('Key agent is undefined')
    }
    return await keyAgent.sign(payload, signable, args)
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
    const derivedAddress = this.getStoreState().getCredentials()?.[0]?.address
    if (derivedAddress === undefined) {
      throw new Error('Derived address is undefined')
    }
    this.getStoreState().setCurrentWallet(derivedAddress)
  }

  getCurrentWallet(): GroupedCredentials | null {
    // Get the current wallet
    const result = this.getStoreState().getCurrentWallet()

    // Return the public credential or null
    return result ? result : null
  }

  getCredentials(): GroupedCredentials[] | null {
    // Get the list of accounts for the current wallet
    const result = this.getStoreState().getCredentials()

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
    this.setCurrentNetworkInStore(
      network,
      this.minaProvider,
      this.minaArchiveProvider
    )
  }

  getCurrentNetwork(): Mina.Networks | null {
    // Get the current network
    const result = this.getStoreState().getCurrentNetwork()
    return result ? result : null
  }

  async setCurrentNetwork(
    network: Mina.Networks,
    nodeUrl: string,
    nodeArchiveUrl: string
  ): Promise<void> {
    // Listen for network change events
    const onMinaProviderNetworkChanged = new Promise((resolve) =>
      this.minaProvider.onNetworkChanged(resolve)
    )
    const onMinaArchiveProviderNetworkChanged = new Promise((resolve) =>
      this.minaArchiveProvider.onNetworkChanged(resolve)
    )

    // Initiate network change
    this.minaProvider.changeNetwork(nodeUrl)
    this.minaArchiveProvider.changeNetwork(nodeArchiveUrl)

    // Wait for both network change events to be emitted
    await Promise.all([
      onMinaProviderNetworkChanged,
      onMinaArchiveProviderNetworkChanged
    ])

    // Check if network change has been successful
    const newNetworkURL = this.minaProvider.providerUrl
    if (nodeUrl !== newNetworkURL) {
      throw new Error('Network URL did not change')
    }

    // Set the current network
    await this.getStoreState().setCurrentNetwork(
      network,
      this.minaProvider,
      this.minaArchiveProvider
    )

    const wallet = this.getCurrentWallet()
    if (wallet) {
      // Now, call syncAccountStore for the current wallet address
      await this.getStoreState().syncAccountStore(
        wallet.address,
        this.minaProvider,
        this.minaArchiveProvider,
        network
      )
    } else {
      console.log('No current wallet available')
    }
  }

  shutdown(): void {
    // Implement the logic to shut down the wallet
  }
}
