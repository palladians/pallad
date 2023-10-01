import {
  GetPassphrase,
  MinaPayload,
  MinaSpecificArgs,
  Network
} from '@palladxyz/key-management'
import { Mina } from '@palladxyz/mina-core'
import { Multichain } from '@palladxyz/multi-chain-core'
import { AccountStore, CredentialStore, KeyAgentStore } from '@palladxyz/vault'
import { keyAgentName } from '@palladxyz/vault'
import Client from 'mina-signer'

import { NetworkManager } from '../../src/Network'
import {
  ProviderManager,
  ProvidersConfig
} from '../../src/Provider/ProviderManager'
//import { expect, test } from 'vitest'
import {
  MinaWalletDependencies,
  MinaWalletImpl,
  MinaWalletProps
} from '../../src/Wallet'
const nodeUrl = 'https://proxy.devnet.minaexplorer.com/'
const archiveUrl = 'https://devnet.graphql.minaexplorer.com'
describe('MinaWalletImpl', () => {
  let wallet: MinaWalletImpl
  let walletDependencies: MinaWalletDependencies
  let walletProperties: MinaWalletProps
  let network: Multichain.MultiChainNetworks
  let keyAgentName: keyAgentName
  let networkConfigurations: ProvidersConfig

  const getPassword: GetPassphrase = async () => Buffer.from('passphrase')
  const mnemonic = [
    'habit',
    'hope',
    'tip',
    'crystal',
    'because',
    'grunt',
    'nation',
    'idea',
    'electric',
    'witness',
    'alert',
    'like'
  ]

  beforeEach(() => {
    networkConfigurations = {
      [Mina.Networks.MAINNET]: {
        nodeUrl: nodeUrl,
        archiveUrl: archiveUrl
      },
      [Mina.Networks.DEVNET]: {
        nodeUrl: 'https://proxy.devnet.minaexplorer.com/',
        archiveUrl: 'https://devnet.graphql.minaexplorer.com'
      },
      [Mina.Networks.BERKELEY]: {
        nodeUrl: 'https://proxy.berkeley.minaexplorer.com/',
        archiveUrl: 'https://berkeley.graphql.minaexplorer.com'
      }
    }
    walletDependencies = {
      // stores
      accountStore: new AccountStore(),
      keyAgentStore: new KeyAgentStore(),
      credentialStore: new CredentialStore(),
      // managers
      networkManager: new NetworkManager<Multichain.MultiChainNetworks>(
        networkConfigurations,
        Mina.Networks.BERKELEY
      ),
      providerManager: new ProviderManager<Multichain.MultiChainNetworks>(
        networkConfigurations
      )
    }
    walletProperties = {
      network: Mina.Networks.BERKELEY,
      name: 'Test Wallet'
    }

    wallet = new MinaWalletImpl(walletProperties, walletDependencies)
    network = walletProperties.network
    keyAgentName = 'test agent'
  })
  test('wallet restores a wallet', async () => {
    const restoreArgs: MinaSpecificArgs = {
      network: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
      networkType: 'testnet'
    }
    const payload = new MinaPayload()
    await wallet.restoreWallet(
      payload,
      restoreArgs,
      network,
      {
        mnemonicWords: mnemonic,
        getPassphrase: getPassword
      },
      keyAgentName
    )

    // check there exists the first account and address in the keyAgent not in the .serializableKeyAgentData knownCredentials
    const derivedCredential = wallet.getCurrentWallet()
    console.log('Derived Credentials:', derivedCredential)
    expect(derivedCredential).toBeDefined()
  })
  test('restores wallet and signs message', async () => {
    // restore wallet
    const args: MinaSpecificArgs = {
      network: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
      networkType: 'testnet'
    }
    const payload = new MinaPayload()
    await wallet.restoreWallet(
      payload,
      args,
      network,
      {
        mnemonicWords: mnemonic,
        getPassphrase: getPassword
      },
      keyAgentName
    )
    // sign message
    const message: Mina.MessageBody = {
      message: 'Hello, Bob!'
    }
    const signedMessage = await wallet.sign(message)
    const minaClient = new Client({ network: args.networkType })
    const isVerified = await minaClient.verifyMessage(
      signedMessage as Mina.SignedMessage
    )
    expect(isVerified).toBeTruthy()
  })
  it('restores wallet and signs transaction', async () => {
    const args: MinaSpecificArgs = {
      network: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
      networkType: 'testnet'
    }
    const payload = new MinaPayload()
    await wallet.restoreWallet(
      payload,
      args,
      network,
      {
        mnemonicWords: mnemonic,
        getPassphrase: getPassword
      },
      keyAgentName
    )
    const groupedCredential = await wallet.getCurrentWallet()

    expect(groupedCredential).toBeDefined()
    if (groupedCredential === null) {
      throw new Error('Grouped credential is null')
    }
    const transaction: Mina.TransactionBody = {
      to: groupedCredential.credential?.address as string,
      from: groupedCredential.credential?.address as string,
      fee: 1,
      amount: 100,
      nonce: 0,
      memo: 'hello Bob',
      validUntil: 321,
      type: 'payment'
    }
    const constructedTx: Mina.ConstructedTransaction = await wallet.constructTx(
      transaction,
      Mina.TransactionKind.PAYMENT
    )
    const signedTx = await wallet.sign(constructedTx)
    const minaClient = new Client({ network: args.networkType })
    const isVerified = minaClient.verifyTransaction(
      signedTx as Mina.SignedTransaction
    )
    expect(isVerified).toBeTruthy()
  })

  test('create wallet of strength 128', async () => {
    const wallet128 = new MinaWalletImpl(walletProperties, walletDependencies)
    const mnemonicStrength = 128
    const walletMnemonic = await wallet128.createWallet(mnemonicStrength)
    expect(walletMnemonic).toHaveProperty('mnemonic')
    expect(walletMnemonic?.mnemonic).toHaveLength(12)
  })
  test('create wallet of strength 256', async () => {
    const wallet256 = new MinaWalletImpl(walletProperties, walletDependencies)
    const mnemonicStrength = 256
    const walletMnemonic = await wallet256.createWallet(mnemonicStrength)
    expect(walletMnemonic).toHaveProperty('mnemonic')
    expect(walletMnemonic?.mnemonic).toHaveLength(24)
  })
})
