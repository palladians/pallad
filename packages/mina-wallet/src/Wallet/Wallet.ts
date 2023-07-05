import {
  generateMnemonic,
  KeyGeneratorFactory,
  Network,
  wordlist
} from '@palladxyz/key-generator'
import {
  AccountInfo,
  Mina,
  SubmitTxArgs,
  SubmitTxResult,
  TransactionsByAddressesArgs
} from '@palladxyz/mina-core'
import {
  AccountInfoGraphQLProvider,
  ChainHistoryGraphQLProvider,
  TxSubmitGraphQLProvider
} from '@palladxyz/mina-graphql'
import {
  ConstructedTransaction,
  constructTransaction,
  SignedTransaction,
  signTransaction
} from '@palladxyz/tx-construction'
import { PublicCredential, VaultStore } from '@palladxyz/vault'

import { MinaWallet } from '../types'

export class MinaWalletImpl implements MinaWallet {
  private accountProvider: AccountInfoGraphQLProvider
  private chainHistoryProvider: ChainHistoryGraphQLProvider
  private transactionSubmissionProvider: TxSubmitGraphQLProvider
  //private networkType: NetworkType
  //private network: Network
  // Storage for the current wallet
  private vaultStore: VaultStore

  constructor(
    accountProvider: AccountInfoGraphQLProvider,
    chainHistoryProvider: ChainHistoryGraphQLProvider,
    transactionSubmissionProvider: TxSubmitGraphQLProvider,
    network: Network,
    vaultStore: VaultStore
  ) {
    this.accountProvider = accountProvider
    this.chainHistoryProvider = chainHistoryProvider
    this.transactionSubmissionProvider = transactionSubmissionProvider
    this.network = network
    this.vaultStore = vaultStore
  }

  async getAccountInfo(publicKey: Mina.PublicKey): Promise<AccountInfo> {
    const accountInfo = await this.accountProvider.getAccountInfo({ publicKey })
    return accountInfo
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

      const transactionPage =
        await this.chainHistoryProvider.transactionsByAddresses(args)

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

    return transactions
  }

  async constructTx(
    transaction: Mina.TransactionBody,
    kind: Mina.TransactionKind
  ): Promise<ConstructedTransaction> {
    const constructedTransaction: ConstructedTransaction = constructTransaction(
      transaction,
      kind
    )
    return constructedTransaction
  }

  async signTx(
    walletPublicKey: string,
    transaction: ConstructedTransaction,
    password: string
  ): Promise<SignedTransaction> {
    // Get the credential for the wallet
    const credential = this.vaultStore.getCredential(walletPublicKey, password)

    // If there's no credential for the wallet, throw an error
    if (!credential) {
      throw new Error('Credential does not exist for the given public key')
    }

    const signedTransaction: SignedTransaction = await signTransaction(
      credential.walletPrivateKey,
      transaction,
      'testnet' // TODO: Define Mina NetworkType which is either 'testnet' or 'mainnet' and include in the vault
    )

    // TODO: Verify that the transaction is valid before returning it
    return signedTransaction
  }

  async submitTx(submitTxArgs: SubmitTxArgs): Promise<SubmitTxResult> {
    const result = await this.transactionSubmissionProvider.submitTx(
      submitTxArgs
    )
    return result
  }

  async createWallet(
    walletName: string,
    network: Network,
    accountNumber: number
  ): Promise<{ publicKey: string; mnemonic: string } | null> {
    const mnemonic = generateMnemonic(wordlist)
    const keyGenerator = KeyGeneratorFactory.create(network)
    const keypair = await keyGenerator.deriveKeyPair({
      mnemonic,
      accountNumber
    })

    if (!keypair) {
      return null
    }

    // Add the new wallet to the credentials
    const newCredential = {
      walletName,
      walletPublicKey: keypair.publicKey,
      walletPrivateKey: keypair.privateKey
    }

    this.vaultStore.addCredential(newCredential)

    // Set the new wallet's public key as the current wallet's public key
    this.vaultStore.setCurrentWalletPublicKey({
      currentWalletPublicKey: keypair.publicKey
    })

    // Return the public key and mnemonic
    return { publicKey: keypair.publicKey, mnemonic }
  }

  async restoreWallet(
    walletName: string,
    network: Network,
    mnemonic: string,
    accountNumber: number
  ): Promise<{ publicKey: string } | null> {
    const keyGenerator = KeyGeneratorFactory.create(network)
    const keypair = await keyGenerator.deriveKeyPair({
      mnemonic,
      accountNumber
    })

    if (!keypair) {
      return null
    }

    // Add the restored wallet to the credentials
    const newCredential = {
      walletName,
      walletPublicKey: keypair.publicKey,
      walletPrivateKey: keypair.privateKey
    }

    this.vaultStore.addCredential(newCredential)

    // Set the restored wallet's public key as the current wallet's public key
    this.vaultStore.setCurrentWalletPublicKey({
      currentWalletPublicKey: keypair.publicKey
    })

    // Return the public key
    return { publicKey: keypair.publicKey }
  }

  getCurrentWallet(): PublicCredential | null {
    // Get the current wallet's public key
    const currentWalletPublicKey = this.vaultStore.getCurrentWalletPublicKey()

    // If there's no current wallet, return null
    if (!currentWalletPublicKey) {
      return null
    }

    // Get the credential for the current wallet
    const credential = this.vaultStore.getCredential(currentWalletPublicKey)

    // If there's no credential for the current wallet, return null
    if (!credential) {
      return null
    }

    // Return the public part of the credential (walletName and walletPublicKey)
    return {
      walletName: credential.walletName,
      walletPublicKey: credential.walletPublicKey
    }
  }

  getAccounts(): string[] {
    // Get all credentials from the vault
    const credentials = this.vaultStore.getCredentials()

    // Map each credential to its public key and return the array of public keys
    return credentials.map(
      (credential: { walletPublicKey: any }) => credential.walletPublicKey
    )
  }

  shutdown(): void {
    // Implement the logic to shut down the wallet
  }
}
