import {
  KeyGeneratorFactory,
  MinaKeyGenerator,
  Network
} from '@palladxyz/key-generator'
import { Mina } from '@palladxyz/mina-core'
import Client from 'mina-signer'
import { expect } from 'vitest'

import { getSignClient } from '../src/minaClient'
import { constructTransaction } from '../src/minaTxBuilder'
import { signTransaction } from '../src/minaTxSigner'
import { NetworkType } from '../src/types'

describe('Transaction Construction & Signing', () => {
  describe('Mainnet Transactions', () => {
    let keyGen: MinaKeyGenerator
    let mnemonic: string
    let client: Client
    let network: NetworkType

    beforeEach(async () => {
      keyGen = new MinaKeyGenerator()
      const network: NetworkType = 'mainnet'
      client = await getSignClient(network)
      mnemonic =
        'habit hope tip crystal because grunt nation idea electric witness alert like' //'climb acquire robot select shaft zebra blush extend evolve host misery busy'
    })

    it('should create a MinaKeyGenerator instance for Mina network', () => {
      const keyGen = KeyGeneratorFactory.create(Network.Mina)
      expect(keyGen).toBeInstanceOf(MinaKeyGenerator)
    })

    it('should return the correct wallet data for a known mnemonic', async () => {
      const expectedKeyPairData = {
        privateKey: 'EKExKH31gXH7t5KiYxdyEbtgi22vgX6wnqwmcbrANs9nQJt487iN',
        publicKey: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
        address: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
        hdIndex: 0
      }
      const keyGen = KeyGeneratorFactory.create(Network.Mina)
      const keyPair = await keyGen.deriveKeyPairByMnemonic(mnemonic, 0, 0, 0)
      expect(keyPair).to.deep.equal(expectedKeyPairData)
    })

    it('Alice should construct & sign a payment transaction correctly to Bob', async () => {
      const keyPairAlice = await keyGen.deriveKeyPairByMnemonic(
        mnemonic,
        0,
        0,
        0
      )
      const keyPairBob = await keyGen.deriveKeyPairByMnemonic(mnemonic, 0, 0, 1)
      const privateKeyAlice = keyPairAlice.privateKey
      const payment: Mina.TransactionBody = {
        type: 'payment',
        to: keyPairBob.publicKey,
        from: keyPairAlice.publicKey,
        fee: 1,
        nonce: 0,
        memo: 'hello Bob',
        validUntil: 321,
        amount: 100
      }

      const constructedPayment = constructTransaction(
        payment,
        Mina.TransactionKind.PAYMENT
      )

      const signedPayment = await signTransaction(
        privateKeyAlice,
        constructedPayment,
        network
      )
      expect(signedPayment.data).toBeDefined()
      expect(signedPayment.signature).toBeDefined()

      const isVerified = client.verifyTransaction(signedPayment)
      expect(isVerified).toBeTruthy()
    })

    it('Alice should construct & sign a delegation transaction correctly', async () => {
      const keyPairAlice = await keyGen.deriveKeyPairByMnemonic(
        mnemonic,
        0,
        0,
        0
      )
      const privateKeyAlice = keyPairAlice.privateKey
      const delegation: Mina.TransactionBody = {
        type: 'delegation',
        to: keyPairAlice.publicKey,
        from: keyPairAlice.publicKey,
        fee: 1,
        nonce: 0
      }

      const constructedDelegation = constructTransaction(
        delegation,
        Mina.TransactionKind.STAKE_DELEGATION
      )

      const signedDelegation = await signTransaction(
        privateKeyAlice,
        constructedDelegation,
        network
      )

      expect(signedDelegation.data).toBeDefined()
      expect(signedDelegation.signature).toBeDefined()

      const isVerified = client.verifyTransaction(signedDelegation)
      expect(isVerified).toBeTruthy()
    })
  })
  describe('Testnet Transactions', () => {
    let keyGen: MinaKeyGenerator
    let mnemonic: string
    let client: Client
    let network: NetworkType

    // Set up the network, client, key generator and mnemonic for every test
    beforeEach(async () => {
      // Create a new MinaKeyGenerator for each test
      keyGen = new MinaKeyGenerator()

      // Specify that we are using the 'testnet'
      network = 'testnet'

      // Get a new sign client for each test
      client = await getSignClient(network)

      // This is a predefined test mnemonic
      mnemonic =
        'habit hope tip crystal because grunt nation idea electric witness alert like'
    })

    // This test checks if the key generator instance is correctly created
    it('should create a MinaKeyGenerator instance for Mina network', () => {
      const keyGen = KeyGeneratorFactory.create(Network.Mina)
      expect(keyGen).toBeInstanceOf(MinaKeyGenerator)
    })

    // This test checks if the correct wallet data is returned for a known mnemonic
    it('should return the correct wallet data for a known mnemonic', async () => {
      // Expected data for the test mnemonic
      const expectedKeyPairData = {
        privateKey: 'EKExKH31gXH7t5KiYxdyEbtgi22vgX6wnqwmcbrANs9nQJt487iN',
        publicKey: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
        address: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
        hdIndex: 0
      }

      const keyGen = KeyGeneratorFactory.create(Network.Mina)
      const keyPair = await keyGen.deriveKeyPairByMnemonic(mnemonic, 0, 0, 0)
      expect(keyPair).to.deep.equal(expectedKeyPairData)
    })

    // This test checks if a payment transaction from Alice to Bob is correctly constructed and signed
    it('Alice should construct & sign a payment transaction correctly to Bob', async () => {
      const keyPairAlice = await keyGen.deriveKeyPairByMnemonic(
        mnemonic,
        0,
        0,
        0
      )
      const keyPairBob = await keyGen.deriveKeyPairByMnemonic(mnemonic, 0, 0, 1)
      const privateKeyAlice = keyPairAlice.privateKey
      const payment: Mina.TransactionBody = {
        type: 'payment',
        to: keyPairBob.publicKey,
        from: keyPairAlice.publicKey,
        fee: 1,
        nonce: 0,
        memo: 'hello Bob',
        validUntil: 321,
        amount: 100
      }

      const constructedPayment = constructTransaction(
        payment,
        Mina.TransactionKind.PAYMENT
      )

      const signedPayment = await signTransaction(
        privateKeyAlice,
        constructedPayment,
        network
      )

      console.log('keyPairAlice 0/0/0', keyPairAlice)
      console.log('keyPairBob 0/0/1', keyPairBob)
      console.log('payment', payment)
      console.log('constructedPayment', constructedPayment)
      console.log('signedPayment', signedPayment)
      expect(signedPayment.data).toBeDefined()
      expect(signedPayment.signature).toBeDefined()

      const isVerified = client.verifyTransaction(signedPayment)
      expect(isVerified).toBeTruthy()
    })

    // This test checks if a delegation transaction is correctly constructed and signed
    it('Alice should construct & sign a delegation transaction correctly', async () => {
      const keyPairAlice = await keyGen.deriveKeyPairByMnemonic(
        mnemonic,
        0,
        0,
        0
      )
      const privateKeyAlice = keyPairAlice.privateKey
      const delegation: Mina.TransactionBody = {
        type: 'delegation',
        to: keyPairAlice.publicKey,
        from: keyPairAlice.publicKey,
        fee: 1,
        nonce: 0
      }

      const constructedDelegation = constructTransaction(
        delegation,
        Mina.TransactionKind.STAKE_DELEGATION
      )

      const signedDelegation = await signTransaction(
        privateKeyAlice,
        constructedDelegation,
        network
      )

      expect(signedDelegation.data).toBeDefined()
      expect(signedDelegation.signature).toBeDefined()

      const isVerified = client.verifyTransaction(signedDelegation)
      expect(isVerified).toBeTruthy()
    })
  })
})
