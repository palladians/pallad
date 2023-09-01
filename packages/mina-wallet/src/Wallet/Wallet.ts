import {
  ChainSignablePayload,
  ChainSignatureResult,
  ChainSpecificArgs,
  ChainSpecificPayload,
  constructTransaction,
  FromBip39MnemonicWordsProps,
  generateMnemonicWords,
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
import {
  AccountStore,
  credentialName,
  CredentialStore,
  keyAgentName,
  keyAgents,
  KeyAgentStore,
  SingleCredentialState,
  SingleKeyAgentState,
  storedCredential
} from '@palladxyz/vaultv2'
import { EventEmitter } from 'events'

/**
 * This wallet is in the process of becoming chain agnostic
 */
import { MinaWallet } from '../types'
import { getRandomAnimalName } from './utils'

export interface MinaWalletDependencies {
  accountStore: AccountStore
  keyAgentStore: KeyAgentStore
  credentialStore: CredentialStore
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
  private keyAgentStore: KeyAgentStore
  private accountStore: AccountStore
  private credentialStore: CredentialStore
  readonly balance: number
  private networkSwitch: EventEmitter
  private currentWallet: SingleCredentialState | null

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
    { accountStore, keyAgentStore, credentialStore }: MinaWalletDependencies
  ) {
    this.network = network
    this.keyAgentStore = keyAgentStore
    this.accountStore = accountStore
    this.credentialStore = credentialStore
    this.name = name
    this.balance = 0
    this.networkSwitch = new EventEmitter()
    this.currentWallet = null

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
  // Event listener for network change
  public onNetworkChanged(listener: (network: Mina.Networks) => void) {
    this.networkSwitch.removeAllListeners('networkChanged')
    this.networkSwitch.on('networkChanged', listener)
  }
  /**
   *
   * @returns {KeyAgentStore} The KeyAgentStore
   */
  private getKeyAgentStore() {
    return this.keyAgentStore
  }
  /**
   *
   * @returns {AccountStore} The AccountStore
   */
  private getAccountStore() {
    return this.accountStore
  }
  /**
   *
   * @returns {CredentialStore} The CredentialStore
   */
  private getCredentialStore() {
    return this.credentialStore
  }
  /**
   *
   * @returns
   */
  getCurrentWallet(): SingleCredentialState | null {
    // Return the public credential or null
    return this.currentWallet
  }

  setCurrentWallet(credential: SingleCredentialState): void {
    // Set the current wallet
    this.currentWallet = credential
  }

  /**
   *
   * @returns
   */
  /*getCredentials(): GroupedCredentials[] | null {
    // Return the list of accounts for the current wallet
    return this.getCredentialStore().getCredentials()
  }*/

  getCurrentNetwork(): Mina.Networks {
    // Get the current network
    return this.network
  }

  setCurrentNetwork(network: Mina.Networks): void {
    // set the current network property
    this.network = network
  }

  /**
   *
   * @returns a keyAgent that can sign operations
   */
  getKeyAgent(name: keyAgentName): SingleKeyAgentState | null {
    return this.getKeyAgentStore().getKeyAgent(name)
  }

  async switchNetwork(network: Mina.Networks): Promise<void> {
    if (this.minaProviders[network] === null) {
      throw new Error('Mina provider is undefined')
    }
    if (this.minaArchiveProviders[network] === null) {
      throw new Error('Mina archive provider is undefined')
    }
    // Switch the network
    this.setCurrentNetwork(network)
    // sync the wallet
    const currentWallet = this.getCurrentWallet()
    if (currentWallet === null) {
      throw new Error('Current wallet is null, empty or undefined')
    }

    await this.syncWallet(network, currentWallet.credential)

    this.networkSwitch.emit('networkChanged', network)
  }

  getName(): string {
    return this.name
  }

  async getAccountInfo(): Promise<AccountInfo | null> {
    const currentWallet = this.getCurrentWallet()
    if (currentWallet === null) {
      throw new Error('Current wallet is null, empty or undefined')
    }
    const walletAddress = currentWallet.credential?.address
    if (walletAddress === undefined) {
      throw new Error('Wallet address is undefined')
    }
    const currentNetwork = this.getCurrentNetwork()
    if (currentNetwork === null) {
      throw new Error('Current network is null, empty or undefined')
    }
    const accountInformation =
      this.getAccountStore().getAccountInfo(currentNetwork, walletAddress)
        ?.accountInfo || null

    return accountInformation
  }

  async getTransactions(): Promise<Mina.TransactionBody[] | null> {
    const currentWallet = this.getCurrentWallet()
    if (currentWallet === null) {
      throw new Error('Current wallet is null, empty or undefined')
    }
    const walletAddress = currentWallet.credential?.address
    if (walletAddress === undefined) {
      throw new Error('Wallet address is undefined')
    }
    const currentNetwork = this.getCurrentNetwork()
    if (currentNetwork === null) {
      throw new Error('Current network is null, empty or undefined')
    }
    return (
      this.getAccountStore().getTransactions(currentNetwork, walletAddress) ||
      null
    )
  }
  // This can be improved
  async getTransaction({
    hash
  }: {
    hash: string
  }): Promise<Mina.TransactionBody | null> {
    const transactions = await this.getTransactions()
    return (
      transactions?.filter((transaction) => transaction?.hash === hash)?.[0] ||
      null
    )
  }

  async sign(
    signable: ChainSignablePayload,
    keyAgentName: keyAgentName
  ): Promise<ChainSignatureResult | undefined> {
    // use current wallet to sign
    const currentWallet = this.getCurrentWallet()?.credential
    if (currentWallet === undefined) {
      throw new Error('Current wallet is null, empty or undefined')
    }
    // currently only Mina specific
    const args: MinaSpecificArgs = {
      network: currentWallet?.chain as Network.Mina,
      accountIndex: currentWallet?.accountIndex,
      addressIndex: currentWallet?.addressIndex,
      networkType: 'testnet'
    }
    const keyAgent = this.getKeyAgentStore().getKeyAgent(keyAgentName)
    if (keyAgent === null) {
      throw new Error('Key agent is undefined')
    }
    return await keyAgent.keyAgent?.sign(currentWallet, signable, args)
  }

  // This is Mina Specific
  // TODO: Make this chain agnostic
  async constructTx(
    transaction: Mina.TransactionBody,
    kind: Mina.TransactionKind
  ): Promise<Mina.ConstructedTransaction> {
    return constructTransaction(transaction, kind)
  }
  // This is Mina Specific
  // TODO: Make this chain agnostic
  async submitTx(
    submitTxArgs: SubmitTxArgs
  ): Promise<SubmitTxResult | undefined> {
    const network = this.getCurrentNetwork()
    return this.minaProviders[network]?.submitTransaction(submitTxArgs)
  }

  async createWallet(strength = 128): Promise<{ mnemonic: string[] } | null> {
    return { mnemonic: generateMnemonicWords(strength) }
  }

  async restoreWallet<T extends ChainSpecificPayload>(
    payload: T,
    args: ChainSpecificArgs,
    network: Mina.Networks,
    { mnemonicWords, getPassphrase }: FromBip39MnemonicWordsProps,
    keyAgentName: keyAgentName,
    keyAgentType: keyAgents = keyAgents.inMemory,
    credentialName: credentialName = getRandomAnimalName()
  ): Promise<void> {
    // Restore a wallet from a mnemonic
    const agentArgs: FromBip39MnemonicWordsProps = {
      getPassphrase: getPassphrase,
      mnemonicWords: mnemonicWords,
      mnemonic2ndFactorPassphrase: ''
    }

    // restore the agent state
    await this.getKeyAgentStore().initialiseKeyAgent(
      keyAgentName,
      keyAgentType,
      agentArgs
    )
    const keyAgent = this.getKeyAgentStore().getKeyAgent(keyAgentName)
    // set the current wallet
    const derivedCredential = await keyAgent.keyAgent?.deriveCredentials(
      payload,
      args,
      getPassphrase,
      false
    )
    // write credential to credential store
    if (derivedCredential === undefined) {
      throw new Error('Derived credential is undefined')
    }

    const singleCredentialState: SingleCredentialState = {
      credentialName: credentialName,
      keyAgentName: keyAgentName,
      credential: derivedCredential
    }
    this.getCredentialStore().setCredential(singleCredentialState)
    // set the current wallet
    this.setCurrentWallet(singleCredentialState)

    // sync the wallet
    await this.syncWallet(network, derivedCredential)
  }
  private async syncWallet(
    network: Mina.Networks,
    derivedCredential: storedCredential
  ): Promise<void> {
    if (derivedCredential === undefined) {
      throw new Error('Derived credential is undefined')
    }
    // sync the wallet
    if (this.minaProviders[network] === null) {
      throw new Error('Mina provider is undefined')
    }
    if (this.minaArchiveProviders[network] === null) {
      throw new Error('Mina archive provider is undefined')
    }
    // fetch wallet properties
    const accountInfo = await this.minaProviders[network]?.getAccountInfo({
      publicKey: derivedCredential.address
    })
    if (accountInfo === undefined) {
      throw new Error('Account info is undefined')
    }
    const transactions = await this.minaArchiveProviders[
      network
    ]?.getTransactions({ addresses: [derivedCredential.address] })
    if (transactions === undefined) {
      throw new Error('Transactions are undefined')
    }
    // set wallet properties
    // set account info
    this.getAccountStore().setAccountInfo(
      network,
      derivedCredential.address,
      accountInfo
    )
    // set transactions
    this.getAccountStore().setTransactions(
      network,
      derivedCredential.address,
      transactions.pageResults
    )
  }
  shutdown(): void {
    // Implement the logic to shut down the wallet
  }
}
