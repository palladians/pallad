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

import { AddressError, NetworkError, WalletError } from '../Errors'
// import managers
import { NetworkManager } from '../Network'
import { ProviderManager } from '../Provider'
/**
 * This wallet is in the process of becoming chain agnostic
 */
import { MinaWallet } from '../types'
import { getRandomAnimalName } from './utils'

export interface MinaWalletDependencies {
  // stores
  accountStore: AccountStore
  keyAgentStore: KeyAgentStore
  credentialStore: CredentialStore
  // managers
  networkManager: NetworkManager
  providerManager: ProviderManager
}

export interface MinaWalletProps {
  readonly network: Mina.Networks
  readonly name: string
}

export class MinaWalletImpl implements MinaWallet {
  public network: Mina.Networks
  // stores
  private keyAgentStore: KeyAgentStore
  private accountStore: AccountStore
  private credentialStore: CredentialStore
  // managers
  private networkManager: NetworkManager
  private providerManager: ProviderManager
  // other things
  readonly balance: number
  private currentWallet: SingleCredentialState | null

  readonly name: string

  constructor(
    { network, name }: MinaWalletProps,
    {
      accountStore,
      keyAgentStore,
      credentialStore,
      networkManager,
      providerManager
    }: MinaWalletDependencies
  ) {
    this.network = network
    // stores
    this.keyAgentStore = keyAgentStore
    this.accountStore = accountStore
    this.credentialStore = credentialStore
    // managers
    this.networkManager = networkManager
    this.providerManager = providerManager
    // other things
    this.name = name
    this.balance = 0
    this.currentWallet = null
  }
  private _validateCurrentWallet(wallet: SingleCredentialState | null): void {
    if (!wallet || !wallet.credential?.address) {
      throw new WalletError('Invalid current wallet or address')
    }
  }

  private _validateCurrentNetwork(network: Mina.Networks | null): void {
    if (!network) {
      throw new NetworkError('Invalid current network')
    }
  }

  // Event listener for network change
  public onNetworkChanged(listener: (network: Mina.Networks) => void) {
    this.networkManager.onNetworkChanged(listener)
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

  getCurrentNetwork(): Mina.Networks {
    // Get the current network
    return this.networkManager.getCurrentNetwork()
  }

  /**
   *
   * @returns a keyAgent that can sign operations
   */
  getKeyAgent(name: keyAgentName): SingleKeyAgentState | null {
    return this.getKeyAgentStore().getKeyAgent(name)
  }

  async switchNetwork(network: Mina.Networks): Promise<void> {
    const provider = this.networkManager.getActiveProvider()
    const archiveProvider = this.networkManager.getActiveArchiveProvider()

    if (!provider) {
      throw new NetworkError(
        'Mina provider is undefined in switchNetwork method'
      )
    }

    if (!archiveProvider) {
      throw new NetworkError(
        'Mina archive provider is undefined in switchNetwork method'
      )
    }

    // Switch the network using NetworkManager
    this.networkManager.switchNetwork(network)
    // Note: The above line will also emit the 'networkChanged' event internally.

    // Sync the wallet
    const currentWallet = this.getCurrentWallet()
    if (!currentWallet) {
      throw new Error('Current wallet is null, empty or undefined')
    }

    await this.syncWallet(network, currentWallet.credential)
  }

  getName(): string {
    return this.name
  }

  async getAccountInfo(): Promise<AccountInfo | null> {
    const currentWallet = this.getCurrentWallet()
    this._validateCurrentWallet(currentWallet)

    const currentNetwork = this.getCurrentNetwork()
    this._validateCurrentNetwork(currentNetwork)

    const accountInformation =
      this.getAccountStore().getAccountInfo(
        currentNetwork,
        currentWallet?.credential?.address as string
      )?.accountInfo || null
    return accountInformation
  }

  async getTransactions(): Promise<Mina.TransactionBody[] | null> {
    const currentWallet = this.getCurrentWallet()
    if (currentWallet === null) {
      throw new WalletError(
        'Current wallet is null, empty or undefined in getTransactions method'
      )
    }

    const walletAddress = currentWallet.credential?.address
    if (walletAddress === undefined) {
      throw new AddressError(
        'Wallet address is undefined in getTransactions method'
      )
    }
    const currentNetwork = this.getCurrentNetwork()
    if (currentNetwork === null) {
      throw new NetworkError(
        'Current network is null, empty or undefined in getTransactions method'
      )
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
      throw new WalletError(
        'Current wallet is null, empty or undefined in sign method'
      )
    }
    // currently only Mina specific
    const args: MinaSpecificArgs = {
      network: currentWallet?.chain as Network.Mina,
      accountIndex: currentWallet?.accountIndex,
      addressIndex: currentWallet?.addressIndex,
      networkType: 'testnet' // TODO: Make this dynamic
    }
    const keyAgent = this.getKeyAgentStore().getKeyAgent(keyAgentName)
    if (keyAgent === null) {
      throw new WalletError('Key agent is undefined in sign method')
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
    const txResult = await this.providerManager
      .getProvider(network)
      ?.submitTransaction(submitTxArgs)
    // add pending transaction to the store
    this.syncTransactions(network, this.getCurrentWallet()?.credential)
    return txResult
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
      throw new WalletError(
        'Derived credential is undefined in restoreWallet method'
      )
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

  private async syncTransactions(
    network: Mina.Networks,
    derivedCredential: storedCredential
  ): Promise<void> {
    if (derivedCredential === undefined) {
      throw new Error('Derived credential is undefined')
    }
    // sync the transactions
    if (this.providerManager.getArchiveProvider(network) === null) {
      throw new NetworkError(
        'Mina archive provider is undefined in syncTransactions method'
      )
    }
    const transactions = await this.providerManager
      .getArchiveProvider(network)
      ?.getTransactions({ addresses: [derivedCredential.address] })
    if (transactions === undefined) {
      throw new WalletError(
        'Transactions are undefined in syncTransactions method'
      )
    }
    // set transactions
    this.getAccountStore().setTransactions(
      network,
      derivedCredential.address,
      transactions.pageResults
    )
  }

  private async syncAccountInfo(
    network: Mina.Networks,
    derivedCredential: storedCredential
  ): Promise<void> {
    if (derivedCredential === undefined) {
      throw new WalletError(
        'Derived credential is undefined in syncAccountInfo method'
      )
    }
    // sync the account info
    if (this.providerManager.getProvider(network) === null) {
      throw new NetworkError(
        'Mina provider is undefined in syncAccountInfo method'
      )
    }
    const accountInfo = await this.providerManager
      .getProvider(network)
      ?.getAccountInfo({
        publicKey: derivedCredential.address
      })
    if (accountInfo === undefined) {
      throw new WalletError(
        'Account info is undefined in syncAccountInfo method'
      )
    }
    // set account info
    this.getAccountStore().setAccountInfo(
      network,
      derivedCredential.address,
      accountInfo
    )
  }

  private async syncWallet(
    network: Mina.Networks,
    derivedCredential: storedCredential
  ): Promise<void> {
    if (derivedCredential === undefined) {
      throw new WalletError(
        'Derived credential is undefined in syncWallet method'
      )
    }
    // sync the wallet
    if (this.providerManager.getProvider(network) === null) {
      throw new NetworkError('Mina provider is undefined in syncWallet method')
    }

    if (this.providerManager.getArchiveProvider(network) === null) {
      throw new NetworkError(
        'Mina archive provider is undefined in syncWallet method'
      )
    }
    // use the sync methods to sync the wallet
    await this.syncAccountInfo(network, derivedCredential)
    await this.syncTransactions(network, derivedCredential)
  }
  shutdown(): void {
    // Implement the logic to shut down the wallet
  }
}
