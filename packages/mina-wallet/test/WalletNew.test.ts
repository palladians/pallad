import {
  GetPassphrase,
  MinaPayload,
  MinaSpecificArgs,
  Network
} from '@palladxyz/key-management'
import { Mina } from '@palladxyz/mina-core'
import {
  AccountStore,
  CredentialStore,
  KeyAgentStore
} from '@palladxyz/vaultv2'
import { keyAgentName } from '@palladxyz/vaultv2'

//import { expect, test } from 'vitest'
import {
  MinaWalletDependencies,
  MinaWalletImpl,
  MinaWalletProps
} from '../src/Wallet'
const nodeUrl = 'https://proxy.devnet.minaexplorer.com/'
const archiveUrl = 'https://devnet.graphql.minaexplorer.com'
describe('MinaWalletImpl', () => {
  let wallet: MinaWalletImpl
  let walletDependencies: MinaWalletDependencies
  let walletProperties: MinaWalletProps
  let network: Mina.Networks
  let keyAgentName: keyAgentName

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
    walletDependencies = {
      accountStore: new AccountStore(),
      keyAgentStore: new KeyAgentStore(),
      credentialStore: new CredentialStore()
    }
    walletProperties = {
      network: Mina.Networks.MAINNET,
      name: 'Test Wallet',
      providers: {
        [Mina.Networks.MAINNET]: {
          provider: nodeUrl,
          archive: archiveUrl
        },
        [Mina.Networks.DEVNET]: {
          provider: 'https://proxy.devnet.minaexplorer.com/',
          archive: 'https://devnet.graphql.minaexplorer.com'
        },
        [Mina.Networks.BERKELEY]: {
          provider: 'https://proxy.berkeley.minaexplorer.com/',
          archive: 'https://berkeley.graphql.minaexplorer.com'
        }
      }
    }

    wallet = new MinaWalletImpl(walletProperties, walletDependencies)
    network = Mina.Networks.MAINNET
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
  /*
  test('restores wallet and signs message', async () => {
    // restore wallet
    const args: MinaSpecificArgs = {
      network: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
      networkType: 'testnet'
    }
    const payload = new MinaPayload()
    await wallet.restoreWallet(payload, args, network, {
      mnemonicWords: mnemonic,
      getPassphrase: getPassword
    })
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
    // restore wallet
    const expectedPublicKey: Mina.PublicKey =
      'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'

    const expectedGroupedCredentials = {
      '@context': ['https://w3id.org/wallet/v1'],
      id: 'did:mina:B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
      type: 'MinaAddress',
      controller:
        'did:mina:B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
      name: 'Mina Account',
      description: 'My Mina account.',
      chain: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
      address: expectedPublicKey
    }

    const args: MinaSpecificArgs = {
      network: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
      networkType: 'testnet'
    }
    const payload = new MinaPayload()
    await wallet.restoreWallet(payload, args, network, {
      mnemonicWords: mnemonic,
      getPassphrase: getPassword
    })
    const groupedCredential = await wallet.getCurrentWallet()

    expect(groupedCredential).to.deep.equal(expectedGroupedCredentials)
    if (groupedCredential === null) {
      throw new Error('Grouped credential is null')
    }
    const transaction: Mina.TransactionBody = {
      to: groupedCredential.address,
      from: groupedCredential.address,
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
    const wallet = new MinaWalletImpl(walletProperties, walletDependencies)
    const mnemonicStrength = 128
    const walletMnemonic = await wallet.createWallet(mnemonicStrength)
    expect(walletMnemonic).toHaveProperty('mnemonic')
    expect(walletMnemonic?.mnemonic).toHaveLength(12)
  })
  test('create wallet of strength 256', async () => {
    const wallet = new MinaWalletImpl(walletProperties, walletDependencies)
    const mnemonicStrength = 256
    const walletMnemonic = await wallet.createWallet(mnemonicStrength)
    expect(walletMnemonic).toHaveProperty('mnemonic')
    expect(walletMnemonic?.mnemonic).toHaveLength(24)
  })
  test('signs and verifies attestation signature', async () => {

    // restore wallet
    const args: MinaSpecificArgs = {
      network: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
      networkType: 'testnet'
    }
    const restorePayload = new MinaPayload()
    await wallet.restoreWallet(restorePayload, args, network, {
      mnemonicWords: mnemonic,
      getPassphrase: getPassword
    })
    // get derived credentials
    const derivedCredentials =
      keyAgentStore.getState().keyAgent?.serializableData.credentialSubject
        .contents
    if (derivedCredentials === undefined) {
      throw new Error('Derived credentials are undefined')
    }
    // attestation payload
    const attestationPayload = {
      context: derivedCredentials[0]['@context'],
      type: 'Attestation',
      issuer: derivedCredentials[0].id,
      issuanceDate: new Date().toISOString(),
      credentialSubject: derivedCredentials[0]
    }

    // convert the attestationPayload object to a string
    const attestationPayloadString: Mina.MessageBody = {
      message: JSON.stringify(attestationPayload)
    }

    // sign attestation
    const signedAttestation = await wallet.sign(attestationPayloadString)
    const minaClient = new Client({ network: args.networkType })
    const isVerified = await minaClient.verifyMessage(
      signedAttestation as Mina.SignedMessage
    )
    expect(isVerified).toBeTruthy()
  })
  */
})
