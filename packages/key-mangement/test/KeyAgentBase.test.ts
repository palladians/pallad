import { Mina } from '@palladxyz/mina-core'
import * as bip32 from '@scure/bip32'
import Client from 'mina-signer'
import sinon from 'sinon'
import { expect } from 'vitest'

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
import * as bip39 from '../src/util/bip39'
import { constructTransaction } from '../src/util/buildTx'

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

  beforeEach(async () => {
    // Generate a mnemonic (24 words)
    //const strength = 128 // increase to 256 for a 24-word mnemonic
    const mnemonic = [
      'climb',
      'acquire',
      'robot',
      'select',
      'shaft',
      'zebra',
      'blush',
      'extend',
      'evolve',
      'host',
      'misery',
      'busy'
    ] //bip39.generateMnemonicWords(strength)
    const seed = bip39.mnemonicToSeed(mnemonic, '')
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
      encryptedRootPrivateKeyBytes: new Uint8Array([
        2, 146,  16, 172,  81,  82, 189, 187,  33, 108,   5,  92,
      208, 242,  67,   5, 140, 148,  20, 127, 200, 181, 213,  40,
      147,   6, 119,  69, 161,  69, 168,  94, 250, 182, 179, 101,
       90,  43,  24, 200, 111, 134, 190, 203, 140,  38,  26, 120,
       12, 209,  46,  38, 125, 224, 216, 149, 142,  93, 216,  70,
      115, 123,  42, 179, 189, 172, 196,  92,  12, 149, 184,  62,
       96, 245, 108,   4, 128, 198,  74, 194,  39,  20,   3, 239,
      188,  22,  15,  71,  11,  74, 196,  97
    ]),
      encryptedCoinTypePrivateKeyBytes: new Uint8Array([
        233, 229,  85, 181, 247, 182,  25,   1, 189,  22,  38, 205,
         60,  33,  64, 190, 118, 100, 154, 123,  77,  31, 214,  14,
        196,  45,  51,  61,  28, 226, 172, 180, 203, 223, 201, 188,
        167, 169, 157, 239,  91, 223, 176,  98, 171, 103, 147, 213,
        144, 122, 220, 171, 230, 162,  83,  93, 229, 243, 120, 142,
         86, 239, 253, 134,  63, 124,  88, 246, 111, 117,  92, 173,
         60, 255, 148,  26, 206, 138, 172,  94, 100, 214, 162, 128,
        146, 108,  17, 195,  35,  60,  90,  74
      ])
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
    const decryptedRootKey = await instance.decryptRootPrivateKey()
    expect(Buffer.from(decryptedRootKey)).to.deep.equal(Buffer.from(rootKeyBytes))
  })

  it('should decrypt coin type key successfully', async () => {
    const decryptedCoinTypeKey = await instance.decryptCoinTypePrivateKey()
    expect(Buffer.from(decryptedCoinTypeKey)).to.deep.equal(Buffer.from(coinTypeKeyBytes))
  })
    
  // TODO: add transaction signing tests
  
  it('should sign transaction successfully', async () => {
    const transaction: Mina.TransactionBody = {
      to: 'B62qn2bkAtVmN6dptpYtU5i9gnq4SwDakFDo7Je7Fp8Tc8TtXnPxfVv',
      from: 'B62qn2bkAtVmN6dptpYtU5i9gnq4SwDakFDo7Je7Fp8Tc8TtXnPxfVv',
      fee: 1,
      amount: 100,
      nonce: 0,
      memo: 'hello Bob',
      validUntil: 321,
      type: 'payment'
    }
    const constructedTx = constructTransaction(transaction, Mina.TransactionKind.PAYMENT)

    //const stubSignTransaction = sinon.stub(minaClient, 'signTransaction')
    //stubSignTransaction.resolves(signedTransaction)
    console.log('constructedTx', constructedTx)

    const result = await instance.signTransaction(
      accountKeyDerivationPath,
      accountAddressDerivationPath,
      constructedTx,
      networkType
    )
    console.log('signed Tx', result)
    //expect(result).to.deep.equal(signedTransaction)
    //sinon.assert.calledOnce(stubSignTransaction)
  })
})
