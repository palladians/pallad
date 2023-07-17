import { Mina } from '@palladxyz/mina-core'
import * as bip32 from '@scure/bip32'
import sinon from 'sinon'
import { expect } from 'vitest'

import { EthereumSpecificPayload } from '../src/chains/Ethereum/types'
import { MinaSpecificPayload } from '../src/chains/Mina'
import { reverseBytes } from '../src/chains/Mina/keyDerivationUtils'
import { emip3encrypt } from '../src/emip3'
import { getPassphraseRethrowTypedError } from '../src/InMemoryKeyAgent'
import { KeyAgentBase } from '../src/KeyAgentBase'
import {
  GetPassphrase,
  KeyAgentType,
  Network,
  SerializableKeyAgentData
} from '../src/types'
import * as util from '../src/util/bip39'

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
  let networkType: Mina.NetworkType
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

    // passphrase
    passphrase = await getPassphraseRethrowTypedError(getPassphrase)
    // define the agent properties
    passphrase = await getPassphraseRethrowTypedError(getPassphrase)
    // Works with seed
    encryptedSeedBytes = await emip3encrypt(seed, passphrase)
  })

  afterEach(() => {
    // Clean up all sinon stubs after each test.
    sinon.restore()
  })

  describe('Mina KeyAgent', () => {
    beforeEach(() => {
      // Define your own appropriate initial data, network, accountKeyDerivationPath, and accountAddressDerivationPath
      serializableData = {
        __typename: KeyAgentType.InMemory,
        encryptedSeedBytes: encryptedSeedBytes,
        id: 'http://example.gov/wallet/3732',
        type: ['VerifiableCredential', 'EncryptedWallet'],
        issuer: 'did:example:123',
        issuanceDate: '2020-05-22T17:38:21.910Z',
        credentialSubject: {
          id: 'did:example:123',
          contents: [] // contents is an array of credentials shoud refactor knownCredentials to contents
        }
      }
      networkType = 'testnet'
      instance = new KeyAgentBaseInstance(serializableData, getPassphrase)
    })
    it('should return the correct knownAddresses', () => {
      expect(instance.knownCredentials).to.deep.equal(
        serializableData.credentialSubject.contents
      )
    })

    it('should return the correct serializableData', () => {
      expect(instance.serializableData).to.deep.equal(serializableData)
    })

    it('should derive correct Mina address', async () => {
      // Define a mocked publicKey, which should be expected from the derivation
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

      const payload: MinaSpecificPayload = {
        network: Network.Mina,
        accountIndex: 0,
        addressIndex: 0,
        networkType: networkType
      }
      console.log('payload', payload)

      const groupedCredential = await instance.deriveCredentials(payload, true)
      console.log('Mina groupedCredential account index 0', groupedCredential)

      expect(groupedCredential).to.deep.equal(expectedGroupedCredentials)
    })

    it('should derive correct address for account index other than 0', async () => {
      // Define a mocked publicKey, which should be expected from the derivation
      const expectedPublicKey: Mina.PublicKey =
        'B62qnhgMG71bvPDvAn3x8dEpXB2sXKCWukj2B6hFKACCHp6uVTCt6HB'

      const expectedGroupedCredentials = {
        '@context': ['https://w3id.org/wallet/v1'],
        id: 'did:mina:B62qnhgMG71bvPDvAn3x8dEpXB2sXKCWukj2B6hFKACCHp6uVTCt6HB',
        type: 'MinaAddress',
        controller:
          'did:mina:B62qnhgMG71bvPDvAn3x8dEpXB2sXKCWukj2B6hFKACCHp6uVTCt6HB',
        name: 'Mina Account',
        description: 'My Mina account.',
        chain: Network.Mina,
        accountIndex: 1,
        addressIndex: 0,
        address: expectedPublicKey
      }

      const payload: MinaSpecificPayload = {
        network: Network.Mina,
        accountIndex: 1,
        addressIndex: 0,
        networkType: networkType
      }

      const groupedCredential = await instance.deriveCredentials(payload, true)
      expect(groupedCredential).to.deep.equal(expectedGroupedCredentials)
    })

    it('should derive multiple unique addresses for each account index and store credentials properly', async () => {
      const mockedPublicKeys: Mina.PublicKey[] = [
        'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
        'B62qnhgMG71bvPDvAn3x8dEpXB2sXKCWukj2B6hFKACCHp6uVTCt6HB'
      ]

      const expectedGroupedCredentialsArray = mockedPublicKeys.map(
        (publicKey, index) => ({
          '@context': ['https://w3id.org/wallet/v1'],
          id: `did:mina:${publicKey}`,
          type: 'MinaAddress',
          controller: `did:mina:${publicKey}`,
          name: 'Mina Account',
          description: 'My Mina account.',
          chain: Network.Mina,
          accountIndex: index,
          addressIndex: 0,
          address: publicKey
        })
      )

      const resultArray = []

      for (let i = 0; i < mockedPublicKeys.length; i++) {
        const payload: MinaSpecificPayload = {
          network: Network.Mina,
          accountIndex: i,
          addressIndex: 0,
          networkType: networkType
        }
        const result = await instance.deriveCredentials(payload)

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

      expect(reverseBytes(originalBuffer)).to.deep.equal(reversedBuffer)
    })

    it('should export root key successfully', async () => {
      const decryptedRootKey = await instance.exportRootPrivateKey()
      expect(decryptedRootKey).to.deep.equal(rootKeyBytes)
    })
  })
  describe('Ethereum KeyAgent', () => {
    beforeEach(() => {
      // Define your own appropriate initial data, network, accountKeyDerivationPath, and accountAddressDerivationPath
      serializableData = {
        __typename: KeyAgentType.InMemory,
        encryptedSeedBytes: encryptedSeedBytes,
        id: 'http://example.gov/wallet/3732',
        type: ['VerifiableCredential', 'EncryptedWallet'],
        issuer: 'did:example:123',
        issuanceDate: '2020-05-22T17:38:21.910Z',
        credentialSubject: {
          id: 'did:example:123',
          contents: [] // contents is an array of credentials shoud refactor knownCredentials to contents
        }
      }
      networkType = 'testnet'
      instance = new KeyAgentBaseInstance(serializableData, getPassphrase)
    })
    it('should return the correct knownAddresses', () => {
      expect(instance.knownCredentials).to.deep.equal(
        serializableData.credentialSubject.contents
      )
    })
    it('should derive correct Ethereum address', async () => {
      // Define a mocked publicKey, which should be expected from the derivation
      const expectedPublicKey = '0xA98005e6ce8E62ADf8f9020fa99888E8f107e3C9'
      const expectedGroupedCredentials = {
        '@context': ['https://w3id.org/wallet/v1'],
        id: 'did:ethr:0xA98005e6ce8E62ADf8f9020fa99888E8f107e3C9',
        type: 'EthereumAddress',
        controller: 'did:ethr:0xA98005e6ce8E62ADf8f9020fa99888E8f107e3C9',
        name: 'Ethereum Account',
        description: 'My Ethereum account.',
        chain: Network.Ethereum,
        accountIndex: 0,
        addressIndex: 0,
        address: expectedPublicKey
      }

      const payload: EthereumSpecificPayload = {
        network: Network.Ethereum,
        accountIndex: 0,
        addressIndex: 0
      }
      console.log('payload', payload)

      const groupedCredential = await instance.deriveCredentials(payload, true)
      console.log(
        'Ethereum groupedCredential account index 0',
        groupedCredential
      )

      expect(groupedCredential).to.deep.equal(expectedGroupedCredentials)
    })
  })
})
