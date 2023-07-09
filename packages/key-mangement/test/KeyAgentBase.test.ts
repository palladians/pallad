import { Mina } from '@palladxyz/mina-core'
import * as bip32 from '@scure/bip32'
import sinon from 'sinon'
import { expect } from 'vitest'

import { KeyAgentBase } from '../src/KeyAgentBase'
import {
  AccountAddressDerivationPath,
  AccountKeyDerivationPath,
  KeyAgentType,
  KeyConst,
  Network,
  SerializableKeyAgentData
} from '../src/types'
import * as bip39 from '../src/util/bip39'

describe('KeyAgentBase', () => {
  class KeyAgentBaseInstance extends KeyAgentBase {
    override decryptCoinTypePrivateKey(): Promise<Uint8Array> {
      throw new Error('Method not implemented.')
    }
    constructor(data: SerializableKeyAgentData) {
      super(data)
    }
  }

  let instance: KeyAgentBaseInstance
  let serializableData: SerializableKeyAgentData
  let accountKeyDerivationPath: AccountKeyDerivationPath
  let accountAddressDerivationPath: AccountAddressDerivationPath
  let networkType: Mina.NetworkType
  let network: Network

  beforeEach(() => {
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
    const rootKeyBytes = root.privateKey ? root.privateKey : Buffer.from([])

    // Derive a child key from the given derivation path
    const purposeKey = root.deriveChild(KeyConst.PURPOSE)
    const coinTypeKey = purposeKey.deriveChild(KeyConst.MINA_COIN_TYPE)
    const cointTypeKeyBytes = coinTypeKey.privateKey
      ? coinTypeKey.privateKey
      : Buffer.from([])

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
      encryptedRootPrivateKeyBytes: rootKeyBytes,
      decryptRootPrivateKey: async () => {
        return Buffer.from(serializableData.encryptedRootPrivateKeyBytes)
      },
      encryptedCoinTypePrivateKeyBytes: cointTypeKeyBytes,
      decryptCoinTypePrivateKey: async () => {
        return Buffer.from(serializableData.encryptedRootPrivateKeyBytes)
      }
    }
    network = Network.Mina
    networkType = 'testnet'
    accountKeyDerivationPath = { account_ix: 0 }
    accountAddressDerivationPath = { address_ix: 0 }
    instance = new KeyAgentBaseInstance(serializableData)
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
    console.log('groupedAddress', groupedAddress)

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

    //console.log(
    //  "the KeyAgent's instance of knownCredentials",
    //  instance.knownCredentials
    //)

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

  // More tests for derivePublicKey, etc...
})
