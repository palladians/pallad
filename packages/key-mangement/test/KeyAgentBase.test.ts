import { Mina } from '@palladxyz/mina-core'
import * as bip32 from '@scure/bip32'
import * as bip39 from '@scure/bip39'
import bs58check from 'bs58check'
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
  KeyConst,
  Network,
  SerializableKeyAgentData
} from '../src/types'
import * as util from '../src/util/bip39'
import { constructTransaction } from '../src/util/buildTx'

function reverseBytes(bytes: Buffer) {
  const uint8 = new Uint8Array(bytes)
  return new Buffer(uint8.reverse())
}
// Provide the passphrase for testing purposes
const params = {
  passphrase: 'passphrase'
}
const getPassphrase = async () => Buffer.from(params.passphrase)

describe('KeyAgentBase', () => {
  class KeyAgentBaseInstance extends KeyAgentBase {
    override exportRootPrivateKey(): Promise<Uint8Array> {
      return Promise.resolve(
        new Uint8Array([
          13, 171, 6, 146, 209, 160, 249, 212, 124, 244, 9, 93, 100, 119, 106,
          182, 8, 206, 168, 211, 211, 121, 250, 248, 228, 4, 35, 169, 204, 12,
          117, 226
        ])
      )
    }

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
  let coinTypeKeyBytes: Uint8Array
  let encryptedRootPrivateKey: Uint8Array
  let encryptedCoinTypePrivateKey: Uint8Array
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
    rootKeyBytes = root.privateKey ? root.privateKey : Buffer.from([])

    // Derive a child key from the given derivation path
    const purposeKey = root.deriveChild(KeyConst.PURPOSE)
    const coinTypeKey = purposeKey.deriveChild(KeyConst.MINA_COIN_TYPE)
    coinTypeKeyBytes = coinTypeKey.privateKey
      ? coinTypeKey.privateKey
      : Buffer.from([])

    // passphrase
    passphrase = await getPassphraseRethrowTypedError(getPassphrase)
    // define the agent properties
    passphrase = await getPassphraseRethrowTypedError(getPassphrase)
    encryptedRootPrivateKey = await emip3encrypt(rootKeyBytes, passphrase)
    encryptedCoinTypePrivateKey = await emip3encrypt(
      coinTypeKeyBytes,
      passphrase
    )

    // Define your own appropriate initial data, network, accountKeyDerivationPath, and accountAddressDerivationPath
    serializableData = {
      __typename: KeyAgentType.InMemory,
      knownCredentials: [
        /*{
          chain: Network.Mina,
          addressIndex: 0,
          accountIndex: 0,
          address: 'B62qkAqbeE4h1M5hop288jtVYxK1MsHVMMcBpaWo8qdsAztgXaHH1xq'
        },
        {
          chain: Network.Mina,
          addressIndex: 0,
          accountIndex: 1,
          address: 'B62qn2bkAtVmN6dptpYtU5i9gnq4SwDakFDo7Je7Fp8Tc8TtXnPxfVv'
        }*/
      ],
      encryptedRootPrivateKeyBytes: encryptedRootPrivateKey,
      encryptedCoinTypePrivateKeyBytes: encryptedCoinTypePrivateKey
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
  it('should derive the correct root and seed keys', async () => {
    const seed = util.mnemonicToSeed(mnemonic)
    const seedBIP39 = await bip39.mnemonicToSeed(
      util.joinMnemonicWords(mnemonic)
    )
    // Create root node from seed
    const root = bip32.HDKey.fromMasterSeed(seed)
    const rootKey = root.privateExtendedKey
      ? root.privateExtendedKey
      : Buffer.from([])
    const expectedSeed =
      '9d394cc4a658fe8023c6ddf1a6bea918d717543c8eeb30c115051a58993ba26c9af33b2f7f1bae7aa9428933b9e01c026619ac579a9cf789c39b4e10a4bf7240'
    const expectedRootKey =
      'xprv9s21ZrQH143K3kFcvB64V5doa7swe81fWMQuMVWCbKGq835dB3E5isyDhjimNjhrbRm171Q5D4Uy4wKGixKUvsy53hhaBPHDVenm1tsKzdz'
    expect(expectedSeed).to.deep.equal(Buffer.from(seed).toString('hex'))
    expect(expectedRootKey).to.deep.equal(rootKey)
    expect(seedBIP39).to.deep.equal(seed)
    const path = `m/${KeyConst.PURPOSE}'/${KeyConst.MINA_COIN_TYPE}'/${accountKeyDerivationPath.account_ix}'/0/${accountAddressDerivationPath.address_ix}`
    const childNode = root.derive(path)
    if (!childNode?.privateKey) throw new Error('Unable to derive private key')
    childNode.privateKey[0] &= 0x3f
    const childPrivateKey = reverseBytes(new Buffer(childNode.privateKey))
    const privateKeyHex = `5a01${childPrivateKey.toString('hex')}`
    const privateKey = bs58check.encode(Buffer.from(privateKeyHex, 'hex'))
    const publicKey = minaClient.derivePublicKey(privateKey)
    console.log('privateKey', privateKey)
    console.log('publicKey', publicKey)
    // This correctly derives the addressses and private keys -- must check against the current keyAgent implementation
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
    const mockedPublicKey: Mina.PublicKey =
      'B62qkAqbeE4h1M5hop288jtVYxK1MsHVMMcBpaWo8qdsAztgXaHH1xq'
    const stubDerivePublicKey = sinon.stub(instance, 'derivePublicKey')
    stubDerivePublicKey.resolves(mockedPublicKey)

    const expectedGroupedCredentials = {
      chain: Network.Mina,
      accountIndex: accountKeyDerivationPath.account_ix,
      address: mockedPublicKey,
      addressIndex: accountAddressDerivationPath.address_ix
    }

    const groupedAddress = await instance.deriveAddress(
      accountKeyDerivationPath,
      accountAddressDerivationPath,
      network,
      networkType,
      true
    )
    //console.log('groupedAddress', groupedAddress)

    expect(groupedAddress).to.deep.equal(expectedGroupedCredentials)
    sinon.assert.calledOnce(stubDerivePublicKey)
  })

  it('should derive correct address for account index other than 0', async () => {
    // Define a mocked publicKey, which should be expected from the derivation
    const mockedPublicKey: Mina.PublicKey =
      'B62qn2bkAtVmN6dptpYtU5i9gnq4SwDakFDo7Je7Fp8Tc8TtXnPxfVv'
    const stubDerivePublicKey = sinon.stub(instance, 'derivePublicKey')
    stubDerivePublicKey.resolves(mockedPublicKey)

    const expectedGroupedCredentials = {
      chain: Network.Mina,
      accountIndex: 1,
      address: mockedPublicKey,
      addressIndex: accountAddressDerivationPath.address_ix
    }

    const groupedAddress = await instance.deriveAddress(
      { account_ix: 1 },
      accountAddressDerivationPath,
      network,
      networkType,
      true
    )
    //console.log('groupedAddress', groupedAddress)

    expect(groupedAddress).to.deep.equal(expectedGroupedCredentials)
    sinon.assert.calledOnce(stubDerivePublicKey)
  })

  it('should derive multiple unique addresses for each account index and store credentials properly', async () => {
    const mockedPublicKeys: Mina.PublicKey[] = [
      'B62qkAqbeE4h1M5hop288jtVYxK1MsHVMMcBpaWo8qdsAztgXaHH1xq',
      'B62qn2bkAtVmN6dptpYtU5i9gnq4SwDakFDo7Je7Fp8Tc8TtXnPxfVv'
    ]

    const stubDerivePublicKey = sinon.stub(instance, 'derivePublicKey')

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
      stubDerivePublicKey.onCall(i).resolves(mockedPublicKeys[i])

      const result = await instance.deriveAddress(
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

    sinon.assert.callCount(stubDerivePublicKey, mockedPublicKeys.length)
    sinon.restore()
  })

  it('should reverse bytes correctly', () => {
    const originalBuffer = Buffer.from('1234', 'hex')
    const reversedBuffer = Buffer.from('3412', 'hex')

    expect(instance.reverseBytes(originalBuffer)).to.deep.equal(reversedBuffer)
  })

  it('should decrypt root key successfully', async () => {
    const decryptedRootKey = await instance.decryptSeed()
    expect(Buffer.from(decryptedRootKey)).to.deep.equal(
      Buffer.from(rootKeyBytes)
    )
  })

  it('should decrypt coin type key successfully', async () => {
    const decryptedCoinTypeKey = await instance.decryptCoinTypePrivateKey()
    expect(Buffer.from(decryptedCoinTypeKey)).to.deep.equal(
      Buffer.from(coinTypeKeyBytes)
    )
  })

  // TODO: add transaction signing tests
  it('should sign transaction successfully', async () => {
    console.log(passphrase)
    console.log(minaClient)
    const credentials = await instance.deriveAddress(
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

    //const stubSignTransaction = sinon.stub(minaClient, 'signTransaction')
    //stubSignTransaction.resolves(signedTransaction)
    //console.log('constructedTx', constructedTx)

    const signedTx = await instance.signTransaction(
      accountKeyDerivationPath,
      accountAddressDerivationPath,
      constructedTx,
      networkType
    )
    console.log('signed Tx', signedTx)
    const isVerified = minaClient.verifyTransaction(signedTx)
    console.log('Signed Transaction isVerified?', isVerified)
    expect(isVerified).toBeTruthy()

    //expect(result).to.deep.equal(signedTransaction)
    //sinon.assert.calledOnce(stubSignTransaction)
  })
})
