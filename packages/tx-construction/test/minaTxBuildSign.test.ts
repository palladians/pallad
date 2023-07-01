import {
  KeyGeneratorFactory,
  MinaKeyGenerator,
  Network
} from '@palladxyz/key-generator'
import Client from 'mina-signer'
import { expect } from 'vitest'

import { getSignClient } from '../src/minaClient'
import { signTransaction } from '../src/minaTxSigner'
import { NetworkType, TransactionBody } from '../src/types'

describe('Transaction Construction & Signing', () => {
  let keyGen: MinaKeyGenerator
  let mnemonic: string
  let client: Client
  let network: NetworkType

  beforeEach(async () => {
    keyGen = new MinaKeyGenerator()
    const network: NetworkType = 'mainnet'
    client = await getSignClient(network)
    mnemonic =
      'habit hope tip crystal because grunt nation idea electric witness alert like'
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
    const keyPairAlice = await keyGen.deriveKeyPairByMnemonic(mnemonic, 0, 0, 0)
    const keyPairBob = await keyGen.deriveKeyPairByMnemonic(mnemonic, 0, 0, 1)
    const privateKeyAlice = keyPairAlice.privateKey
    const payment: TransactionBody = {
      type: 'payment',
      to: keyPairBob.publicKey,
      from: keyPairAlice.publicKey,
      fee: 1,
      nonce: 0,
      memo: 'hello Bob',
      validUntil: 321,
      amount: 100
    }

    const signedPayment = await signTransaction(
      privateKeyAlice,
      payment,
      network
    )
    expect(signedPayment.data).toBeDefined()
    expect(signedPayment.signature).toBeDefined()

    const isVerified = client.verifyTransaction(signedPayment)
    expect(isVerified).toBeTruthy()
  })

  it('Alice should construct & sign a delegation transaction correctly', async () => {
    const keyPairAlice = await keyGen.deriveKeyPairByMnemonic(mnemonic, 0, 0, 0)
    const privateKeyAlice = keyPairAlice.privateKey
    const delegation: TransactionBody = {
      type: 'delegation',
      to: keyPairAlice.publicKey,
      from: keyPairAlice.publicKey,
      fee: 1,
      nonce: 0
    }

    const signedDelegation = await signTransaction(
      privateKeyAlice,
      delegation,
      network
    )
    expect(signedDelegation.data).toBeDefined()
    expect(signedDelegation.signature).toBeDefined()

    const isVerified = client.verifyTransaction(signedDelegation)
    expect(isVerified).toBeTruthy()
  })
})
