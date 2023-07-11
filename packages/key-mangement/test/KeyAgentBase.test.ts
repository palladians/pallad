import { Mina } from '@palladxyz/mina-core'
import * as bip32 from '@scure/bip32'
import Client from 'mina-signer'
import sinon from 'sinon'
import { expect } from 'vitest'

import { emip3encrypt } from '../src/emip3'
import { getPassphraseRethrowTypedError } from '../src/InMemoryKeyAgent'
import { KeyAgentBase } from '../src/KeyAgentBase'
import {
  AccountAddressDerivationPath,
  AccountKeyDerivationPath,
  GetPassphrase,
  KeyAgentType,
  Network,
  SerializableKeyAgentData
} from '../src/types'
import * as util from '../src/util/bip39'
import { constructTransaction } from '../src/util/buildTx'

// Provide the passphrase for testing purposes
const params = {
  passphrase: 'passphrase'
}
const getPassphrase = async () => Buffer.from(params.passphrase)

describe('KeyAgentBase', () => {
  class KeyAgentBaseInstance extends KeyAgentBase {
    constructor(data: SerializableKeyAgentData, getPassphrase: GetPassphrase) {
      super(data, getPassphrase)
    }
  }

  let instance: KeyAgentBaseInstance
  let serializableData: SerializableKeyAgentData
  let accountKeyDerivationPath: AccountKeyDerivationPath
  let accountAddressDerivationPath: AccountAddressDerivationPath
  let networkType: Mina.NetworkType
  let network: Network
  let minaClient: Client
  let passphrase: Uint8Array
  let rootKeyBytes: Uint8Array
  let encryptedSeedBytes: Uint8Array
  let mnemonic: string[]

  beforeEach(async () => {
    // Generate a mnemonic (24 words)
    //const strength = 128 // increase to 256 for a 24-word mnemonic
    mnemonic = [
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
    ] //bip39.generateMnemonicWords(strength)
    const seed = util.mnemonicToSeed(mnemonic)
    // Create root node from seed
    const root = bip32.HDKey.fromMasterSeed(seed)
    // unencrypted root key bytes
    rootKeyBytes = root.privateKey ? root.privateKey : new Uint8Array([])

    // Derive a child key from the given derivation path
    //const purposeKey = root.deriveChild(KeyConst.PURPOSE)
    //const coinTypeKey = purposeKey.deriveChild(KeyConst.MINA_COIN_TYPE)
    //coinTypeKeyBytes = coinTypeKey.privateKey ? coinTypeKey.privateKey : Buffer.from([])

    // passphrase
    passphrase = await getPassphraseRethrowTypedError(getPassphrase)
    // define the agent properties
    passphrase = await getPassphraseRethrowTypedError(getPassphrase)
    // Works with seed
    encryptedSeedBytes = await emip3encrypt(seed, passphrase)

    // Define your own appropriate initial data, network, accountKeyDerivationPath, and accountAddressDerivationPath
    serializableData = {
      __typename: KeyAgentType.InMemory,
      knownCredentials: [],
      encryptedSeedBytes: encryptedSeedBytes
    }
    network = Network.Mina
    networkType = 'testnet'
    accountKeyDerivationPath = { account_ix: 0 }
    accountAddressDerivationPath = { address_ix: 0 }
    instance = new KeyAgentBaseInstance(serializableData, getPassphrase)
    minaClient = new Client({ network: networkType })
  })

  afterEach(() => {
    // Clean up all sinon stubs after each test.
    sinon.restore()
  })

  it('should return the correct knownAddresses', () => {
    expect(instance.knownCredentials).to.deep.equal(
      serializableData.knownCredentials
    )
  })

  it('should return the correct serializableData', () => {
    expect(instance.serializableData).to.deep.equal(serializableData)
  })

  it('should derive correct address', async () => {
    // Define a mocked publicKey, which should be expected from the derivation
    const expectedPublicKey: Mina.PublicKey =
      'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'

    const expectedGroupedCredentials = {
      chain: Network.Mina,
      accountIndex: accountKeyDerivationPath.account_ix,
      address: expectedPublicKey,
      addressIndex: accountAddressDerivationPath.address_ix
    }

    const groupedAddress = await instance.deriveCredentials(
      accountKeyDerivationPath,
      accountAddressDerivationPath,
      network,
      networkType,
      true
    )
    console.log('groupedCredentials account index 0', groupedAddress)

    expect(groupedAddress).to.deep.equal(expectedGroupedCredentials)
  })

  it('should derive correct address for account index other than 0', async () => {
    // Define a mocked publicKey, which should be expected from the derivation
    const expectedPublicKey: Mina.PublicKey =
      'B62qnhgMG71bvPDvAn3x8dEpXB2sXKCWukj2B6hFKACCHp6uVTCt6HB'

    const expectedGroupedCredentials = {
      chain: Network.Mina,
      accountIndex: 1,
      address: expectedPublicKey,
      addressIndex: accountAddressDerivationPath.address_ix
    }

    const groupedAddress = await instance.deriveCredentials(
      { account_ix: 1 },
      accountAddressDerivationPath,
      network,
      networkType,
      true
    )
    console.log('groupedCredentials account index 1', groupedAddress)

    expect(groupedAddress).to.deep.equal(expectedGroupedCredentials)
  })

  it('should derive multiple unique addresses for each account index and store credentials properly', async () => {
    const mockedPublicKeys: Mina.PublicKey[] = [
      'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
      'B62qnhgMG71bvPDvAn3x8dEpXB2sXKCWukj2B6hFKACCHp6uVTCt6HB'
    ]

    const expectedGroupedCredentialsArray = mockedPublicKeys.map(
      (publicKey, index) => ({
        chain: Network.Mina,
        accountIndex: index,
        address: publicKey,
        addressIndex: accountAddressDerivationPath.address_ix
      })
    )

    const resultArray = []

    for (let i = 0; i < mockedPublicKeys.length; i++) {
      const result = await instance.deriveCredentials(
        { account_ix: i },
        accountAddressDerivationPath,
        network,
        networkType
      )

      resultArray.push(result)
    }

    // Check if the credentials were stored properly.
    expect(instance.knownCredentials).to.deep.equal(
      expectedGroupedCredentialsArray
    )
  })

  it('should reverse bytes correctly', () => {
    const originalBuffer = Buffer.from('1234', 'hex')
    const reversedBuffer = Buffer.from('3412', 'hex')

    expect(instance.reverseBytes(originalBuffer)).to.deep.equal(reversedBuffer)
  })

  it('should export root key successfully', async () => {
    const decryptedRootKey = await instance.exportRootPrivateKey()
    expect(decryptedRootKey).to.deep.equal(rootKeyBytes)
  })
  it('should sign transaction successfully', async () => {
    const credentials = await instance.deriveCredentials(
      accountKeyDerivationPath,
      accountAddressDerivationPath,
      network,
      networkType
    )
    const transaction: Mina.TransactionBody = {
      to: credentials.address,
      from: credentials.address,
      fee: 1,
      amount: 100,
      nonce: 0,
      memo: 'hello Bob',
      validUntil: 321,
      type: 'payment'
    }
    const constructedTx = constructTransaction(
      transaction,
      Mina.TransactionKind.PAYMENT
    )
    const signedTx = await instance.signTransaction(
      accountKeyDerivationPath,
      accountAddressDerivationPath,
      constructedTx,
      networkType
    )
    const isVerified = minaClient.verifyTransaction(signedTx)
    expect(isVerified).toBeTruthy()
  })
  it('should use the generic sign<T> function for signing a transaction', async () => {
    const credentials = await instance.deriveCredentials(
      accountKeyDerivationPath,
      accountAddressDerivationPath,
      network,
      networkType
    )
    const transaction: Mina.TransactionBody = {
      to: credentials.address,
      from: credentials.address,
      fee: 1,
      amount: 100,
      nonce: 0,
      memo: 'hello Bob',
      validUntil: 321,
      type: 'payment'
    }
    const constructedTx: Mina.ConstructedTransaction = constructTransaction(
      transaction,
      Mina.TransactionKind.PAYMENT
    )
    const signedTx = await instance.sign<Mina.TransactionBody>(
      accountKeyDerivationPath,
      accountAddressDerivationPath,
      // investigate compiler error
      constructedTx,
      networkType
    )

    const isVerified = minaClient.verifyTransaction(signedTx)
    expect(isVerified).toBeTruthy()
  })

  it('should sign a message correctly and the client should be able to verify it', async () => {
    const message: Mina.MessageBody = {
      message: 'Hello, Bob!'
    }

    const signedMessage = await instance.signMessage(accountKeyDerivationPath,
      accountAddressDerivationPath,
      message,
      networkType)
    const isVerified = await minaClient.verifyMessage(signedMessage)
    expect(isVerified).toBeTruthy()
  })
  it('should use the generic sign<T> function for signing a message', async () => {
    const message: Mina.MessageBody = {
      message: 'Hello, Bob!'
    }
    const signedMessage = await instance.sign<Mina.MessageBody>(accountKeyDerivationPath, accountAddressDerivationPath, message, networkType)
    const isVerified = await minaClient.verifyMessage(signedMessage as Mina.SignedMessage)
    expect(isVerified).toBeTruthy()
  })
})
