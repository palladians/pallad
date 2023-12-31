import * as bip32 from '@scure/bip32'
import { verifyMessage } from 'ethers'
import sinon from 'sinon'
import { expect } from 'vitest'

import { EthereumPayload, EthereumSpecificArgs } from '../../src'
import { emip3encrypt } from '../../src/emip3'
import { getPassphraseRethrowTypedError } from '../../src/InMemoryKeyAgent'
import { KeyAgentBase } from '../../src/KeyAgentBase'
import {
  GetPassphrase,
  KeyAgentType,
  Network,
  SerializableKeyAgentData
} from '../../src/types'
import * as util from '../../src/util/bip39'

// Provide the passphrase for testing purposes
const params = {
  passphrase: 'passphrase'
}
const getPassphrase = async () => Buffer.from(params.passphrase)

describe('KeyAgentBase (Ethereum Functionality)', () => {
  class KeyAgentBaseInstance extends KeyAgentBase {
    constructor(data: SerializableKeyAgentData, getPassphrase: GetPassphrase) {
      super(data, getPassphrase)
    }
  }

  let instance: KeyAgentBaseInstance
  let serializableData: SerializableKeyAgentData
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
    ]
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
          contents: []
        }
      }
      instance = new KeyAgentBaseInstance(serializableData, getPassphrase)
    })
    it('should return the correct empty knownAddresses', () => {
      expect(instance.knownCredentials).to.deep.equal(
        serializableData.credentialSubject.contents
      )
    })
    it('should return the correct empty serializableData', () => {
      expect(instance.serializableData).to.deep.equal(serializableData)
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

      const args: EthereumSpecificArgs = {
        network: Network.Ethereum,
        accountIndex: 0,
        addressIndex: 0
      }
      const payload = new EthereumPayload()

      const groupedCredential = await instance.deriveCredentials(
        payload,
        args,
        getPassphrase,
        true
      )
      expect(groupedCredential.address.toLowerCase()).to.deep.equal(
        expectedGroupedCredentials.address.toLowerCase()
      )
    })
    it('should derive multiple unique Mina addresses for each account index and store credentials properly', async () => {
      const mockedPublicKeys: string[] = [
        '0xA98005e6ce8E62ADf8f9020fa99888E8f107e3C9',
        '0xeDdE271242f7551Ac212B1E254A4987B91F49A2b'
      ]
      const payload = new EthereumPayload()
      const expectedGroupedCredentialsArray = mockedPublicKeys.map(
        (publicKey, index) => ({
          '@context': ['https://w3id.org/wallet/v1'],
          id: `did:ethr:${publicKey}`,
          type: 'EthereumAddress',
          controller: `did:ethr:${publicKey}`,
          name: 'Ethereum Account',
          description: 'My Ethereum account.',
          chain: Network.Ethereum,
          accountIndex: index,
          addressIndex: 0,
          address: publicKey
        })
      )
      const resultArray = []
      for (let i = 0; i < mockedPublicKeys.length; i++) {
        const args: EthereumSpecificArgs = {
          network: Network.Ethereum,
          accountIndex: 0,
          addressIndex: i
        }
        // when pure is false it will store the credentials
        const result = await instance.deriveCredentials(
          payload,
          args,
          getPassphrase,
          false
        )
        resultArray.push(result)
      }
      // Check if the credentials were stored properly.
      expect(instance.knownCredentials[0]?.address.toLowerCase()).to.deep.equal(
        expectedGroupedCredentialsArray[0]?.address.toLowerCase()
      )
      console.log('instance.knownCredentials', instance.knownCredentials)
      expect(instance.knownCredentials[1]?.address).to.deep.equal(
        expectedGroupedCredentialsArray[1]?.address
      )
    })
    it('should export root key successfully', async () => {
      const decryptedRootKey = await instance.exportRootPrivateKey()
      expect(decryptedRootKey).to.deep.equal(rootKeyBytes)
    })
    it('should use the generic sign<T> function for signing a message', async () => {
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

      const args: EthereumSpecificArgs = {
        network: Network.Ethereum,
        accountIndex: 0,
        addressIndex: 0
      }
      const payload = new EthereumPayload()

      const groupedCredential = await instance.deriveCredentials(
        payload,
        args,
        getPassphrase,
        true
      )
      expect(groupedCredential.address.toLowerCase()).to.deep.equal(
        expectedGroupedCredentials.address.toLowerCase()
      )

      const message: string = 'Hello, Bob!'

      const signedMessage = await instance.sign(
        groupedCredential,
        message, // why is this erroring?
        args
      )

      // Recover the address from the signature
      const recoveredAddress = verifyMessage(message, signedMessage as string)

      // In your test case
      expect(recoveredAddress).toEqual(groupedCredential.address)
    })
  })
})
