import {
  KeyGeneratorFactory,
  MinaKeyGenerator,
  Network
} from '@palladxyz/key-generator'
import { expect } from 'vitest'

import { MessageBody, signMessage, verifyMessage } from '../src/minaMsgSigner'
import { NetworkType } from '../src/types'

describe('Message Signing & Verification', () => {
  let keyGen: MinaKeyGenerator
  let mnemonic: string
  let network: NetworkType

  beforeEach(async () => {
    keyGen = new MinaKeyGenerator()
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

  it('Alice should sign a message correctly and Bob should verify it', async () => {
    const keyPairAlice = await keyGen.deriveKeyPairByMnemonic(mnemonic, 0, 0, 0)
    const privateKeyAlice = keyPairAlice.privateKey
    const message: MessageBody = {
      message: 'Hello, Bob!'
    }

    const signedMessage = await signMessage(privateKeyAlice, message, network)
    const isVerified = await verifyMessage(signedMessage, network)
    expect(isVerified).toBeTruthy()
  })
})
