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
import { EventEmitter } from 'events'

/**
 * This wallet is in the process of becoming chain agnostic
 */
import { MinaWallet } from '../types'

export interface MinaWalletDependencies {
  readonly keyAgent: InMemoryKeyAgent | null
}

export interface MinaWalletProps {
  readonly network: Mina.Networks
  readonly name: string
  readonly providers: {
    [network in Mina.Networks]?: {
      provider: string
      archive: string
    }
  }
}

export class MinaWalletImpl implements MinaWallet {
  public network: Mina.Networks
  readonly keyAgent: InMemoryKeyAgent | null
  readonly balance: number
  private networkSwitch: EventEmitter

  private minaProviders: Record<Mina.Networks, MinaProvider | null> = {
    [Mina.Networks.MAINNET]: null,
    [Mina.Networks.DEVNET]: null,
    [Mina.Networks.BERKELEY]: null
  }
  private minaArchiveProviders: Record<
    Mina.Networks,
    MinaArchiveProvider | null
  > = {
    [Mina.Networks.MAINNET]: null,
    [Mina.Networks.DEVNET]: null,
    [Mina.Networks.BERKELEY]: null
  }
  readonly name: string

  constructor(
    { network, name, providers }: MinaWalletProps,
    { keyAgent }: MinaWalletDependencies
  ) {
    this.network = network
    this.keyAgent = keyAgent
    this.name = name
    this.balance = 0
    this.networkSwitch = new EventEmitter()

    // Create providers for each network
    for (const networkKey of Object.keys(providers)) {
      const network = networkKey as Mina.Networks
      if (providers[network]) {
        this.minaProviders[network] = new MinaProvider(
          providers[network]?.provider as string
        )
        this.minaArchiveProviders[network] = new MinaArchiveProvider(
          providers[network]?.archive as string
        )
      }
    }
  }

  public onNetworkChanged(listener: (nodeUrl: string) => void) {
    this.networkSwitch.removeAllListeners('networkChanged')
    this.networkSwitch.on('networkChanged', listener)
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
  async submitTx(
    submitTxArgs: SubmitTxArgs
  ): Promise<SubmitTxResult | undefined> {
    const network = this.getCurrentNetwork()
    const result = await this.minaProviders[network]?.submitTransaction(
      submitTxArgs
    )
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
    if (this.minaProviders[network] === null) {
      throw new Error('Mina provider is undefined')
    }
    if (this.minaArchiveProviders[network] === null) {
      throw new Error('Mina archive provider is undefined')
    }
    // restore the agent state
    await keyAgentStore
      .getState()
      .restoreWallet(
        payload,
        args,
        this.minaProviders[network] as MinaProvider,
        this.minaArchiveProviders[network] as MinaArchiveProvider,
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

  async switchNetwork(network: Mina.Networks): Promise<void> {
    if (this.minaProviders[network] === null) {
      throw new Error('Mina provider is undefined')
    }
    if (this.minaArchiveProviders[network] === null) {
      throw new Error('Mina archive provider is undefined')
    }
    // Switch the network
    await this.setCurrentNetwork(network)
    this.setCurrentNetworkInStore(
      network,
      this.minaProviders[network] as MinaProvider,
      this.minaArchiveProviders[network] as MinaArchiveProvider
    )
    this.networkSwitch.emit('networkChanged', network)
  }

  getCurrentNetwork(): Mina.Networks {
    // Get the current network
    const result = this.network
    return result
  }

  async setCurrentNetwork(network: Mina.Networks): Promise<void> {
    // set the current network property
    this.network = network

    // Set the current network in store
    await this.getStoreState().setCurrentNetwork(
      network,
      this.minaProviders[network] as MinaProvider,
      this.minaArchiveProviders[network] as MinaArchiveProvider
    )

    const wallet = this.getCurrentWallet()
    if (wallet) {
      // Now, call syncAccountStore for the current wallet address
      await this.getStoreState().syncAccountStore(
        wallet.address,
        this.minaProviders[network] as MinaProvider,
        this.minaArchiveProviders[network] as MinaArchiveProvider,
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
