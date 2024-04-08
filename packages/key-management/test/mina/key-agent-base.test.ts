import { Mina } from '@palladxyz/mina-core'
import * as bip32 from '@scure/bip32'
import Client from 'mina-signer'
import sinon from 'sinon'
import { expect } from 'vitest'

import { MinaPayload, MinaSpecificArgs } from '../../src/chains/Mina'
import { reverseBytes } from '../../src/chains/Mina/keyDerivationUtils'
import { emip3encrypt } from '../../src/emip3'
import { getPassphraseRethrowTypedError } from '../../src/InMemoryKeyAgent'
import { KeyAgentBase } from '../../src/KeyAgentBase'
import {
  ChainOperationArgs,
  GetPassphrase,
  KeyAgentType,
  Network,
  SerializableKeyAgentData
} from '../../src/types'
import * as util from '../../src/util/bip39'
import { constructTransaction } from '../../src/util/Transactions/buildMinaTx'

// Provide the passphrase for testing purposes
const params = {
  passphrase: 'passphrase'
}
const getPassphrase = () =>
  new Promise<Uint8Array>((resolve) => resolve(Buffer.from(params.passphrase)))

describe('KeyAgentBase (Mina Functionality)', () => {
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
          contents: []
        }
      }
      networkType = 'testnet'
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

      const args: MinaSpecificArgs = {
        network: Network.Mina,
        accountIndex: 0,
        addressIndex: 0,
        networkType: networkType
      }
      const payload = new MinaPayload()

      const groupedCredential = await instance.deriveCredentials(
        payload,
        args,
        getPassphrase,
        true
      )

      expect(groupedCredential.address).to.deep.equal(
        expectedGroupedCredentials.address
      )
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

      const args: MinaSpecificArgs = {
        network: Network.Mina,
        accountIndex: 1,
        addressIndex: 0,
        networkType: networkType
      }
      const payload = new MinaPayload()

      const groupedCredential = await instance.deriveCredentials(
        payload,
        args,
        getPassphrase,
        true
      )
      expect(groupedCredential.address).to.deep.equal(
        expectedGroupedCredentials.address
      )
    })

    it('should derive multiple unique Mina addresses for each account index and store credentials properly', async () => {
      const mockedPublicKeys: Mina.PublicKey[] = [
        'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
        'B62qnhgMG71bvPDvAn3x8dEpXB2sXKCWukj2B6hFKACCHp6uVTCt6HB'
      ]
      const payload = new MinaPayload()

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
        const args: MinaSpecificArgs = {
          network: Network.Mina,
          accountIndex: i,
          addressIndex: 0,
          networkType: networkType
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
      expect(instance.knownCredentials[0]?.address).to.deep.equal(
        expectedGroupedCredentialsArray[0]?.address
      )
      expect(instance.knownCredentials[1]?.address).to.deep.equal(
        expectedGroupedCredentialsArray[1]?.address
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
    it('should use the generic sign<T> function for signing a transaction', async () => {
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

      const args: MinaSpecificArgs = {
        network: Network.Mina,
        accountIndex: 0,
        addressIndex: 0,
        networkType: networkType
      }
      const payload = new MinaPayload()

      const groupedCredential = await instance.deriveCredentials(
        payload,
        args,
        getPassphrase,
        true
      )

      expect(groupedCredential.address).to.deep.equal(
        expectedGroupedCredentials.address
      )

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
      const constructedTx: Mina.ConstructedTransaction = constructTransaction(
        transaction,
        Mina.TransactionKind.PAYMENT
      )
      const signedTx = await instance.sign(
        groupedCredential,
        constructedTx,
        args
      )
      const minaClient = new Client({ network: args.networkType })
      const isVerified = minaClient.verifyTransaction(
        signedTx as Mina.SignedTransaction
      )
      expect(isVerified).toBeTruthy()
    })
    it('should use the generic sign<T> function for signing a message', async () => {
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

      const args: MinaSpecificArgs = {
        network: Network.Mina,
        accountIndex: 0,
        addressIndex: 0,
        networkType: networkType
      }
      const payload = new MinaPayload()

      const groupedCredential = await instance.deriveCredentials(
        payload,
        args,
        getPassphrase,
        true
      )
      expect(groupedCredential.address).to.deep.equal(
        expectedGroupedCredentials.address
      )

      const message: Mina.MessageBody = {
        message: 'Hello, Bob!'
      }
      const signedMessage = await instance.sign(groupedCredential, message, {
        network: Network.Mina,
        operation: 'mina_sign',
        networkType: 'testnet'
      } as ChainOperationArgs)
      const minaClient = new Client({ network: args.networkType })
      const isVerified = await minaClient.verifyMessage(
        signedMessage as Mina.SignedMessage
      )
      expect(isVerified).toBeTruthy()
    })
    it('should use the generic sign<T> function to sign fields correctly and the client should be able to verify it', async () => {
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

      const args: MinaSpecificArgs = {
        network: Network.Mina,
        accountIndex: 0,
        addressIndex: 0,
        networkType: networkType
      }
      const payload = new MinaPayload()

      const groupedCredential = await instance.deriveCredentials(
        payload,
        args,
        getPassphrase,
        true
      )
      expect(groupedCredential.address).to.deep.equal(
        expectedGroupedCredentials.address
      )

      const fields: Mina.SignableFields = {
        fields: [
          BigInt(10),
          BigInt(20),
          BigInt(30),
          BigInt(340817401),
          BigInt(2091283),
          BigInt(1),
          BigInt(0)
        ]
      }
      const signedFields = await instance.sign(groupedCredential, fields, {
        network: Network.Mina,
        operation: 'mina_signFields',
        networkType: 'testnet'
      } as ChainOperationArgs)
      const minaClient = new Client({ network: args.networkType })
      const isVerified = await minaClient.verifyFields(
        signedFields as Mina.SignedFields
      )
      expect(isVerified).toBeTruthy()
    })
    it('should use the generic sign<T> function to create a nullifier correctly and the client should be able to verify it', async () => {
      const args: MinaSpecificArgs = {
        network: Network.Mina,
        accountIndex: 0,
        addressIndex: 0,
        networkType: networkType
      }
      const payload = new MinaPayload()

      const groupedCredential = await instance.deriveCredentials(
        payload,
        args,
        getPassphrase,
        true
      )

      const nullifier: Mina.CreatableNullifer = {
        message: [BigInt(10)]
      }
      const createdNullifier = await instance.sign(
        groupedCredential,
        nullifier,
        {
          network: Network.Mina,
          operation: 'mina_createNullifier',
          networkType: 'testnet'
        } as ChainOperationArgs
      )

      console.log('createdNullifier', createdNullifier)
      expect(createdNullifier).not.toBeUndefined()
    })
    it('should use the generic sign<T> function to create a nullifier using the args `operation` field --correctly and the client should be able to verify it', async () => {
      const args: MinaSpecificArgs = {
        network: Network.Mina,
        accountIndex: 0,
        addressIndex: 0,
        networkType: networkType,
        operation: 'mina_createNullifier'
      }
      const payload = new MinaPayload()

      const groupedCredential = await instance.deriveCredentials(
        payload,
        args,
        getPassphrase,
        true
      )

      const nullifier: Mina.CreatableNullifer = {
        message: [BigInt(10)]
      }

      const operations: ChainOperationArgs = {
        operation: 'mina_createNullifier',
        network: 'Mina',
        networkType: 'testnet'
      }

      const createdNullifier = await instance.sign(
        groupedCredential,
        nullifier,
        operations
      )

      expect(createdNullifier).not.toBeUndefined()
    })
  })
})
