import { HDKey } from '@scure/bip32'
import { expect } from 'vitest'

import { MinaKeyGenerator } from '../src/mina'
import { KeyConst } from '../src/types'

describe('MinaKeyGenerator', () => {
  let mina: MinaKeyGenerator
  let mnemonic: string
  let expectedSeed: string
  let expectedRootKey: string

  beforeEach(() => {
    mina = new MinaKeyGenerator()
    mnemonic =
      'habit hope tip crystal because grunt nation idea electric witness alert like'
    expectedSeed =
      '9d394cc4a658fe8023c6ddf1a6bea918d717543c8eeb30c115051a58993ba26c9af33b2f7f1bae7aa9428933b9e01c026619ac579a9cf789c39b4e10a4bf7240'
    expectedRootKey =
      'xprv9s21ZrQH143K3kFcvB64V5doa7swe81fWMQuMVWCbKGq835dB3E5isyDhjimNjhrbRm171Q5D4Uy4wKGixKUvsy53hhaBPHDVenm1tsKzdz'
  })

  it('should correctly set constants', () => {
    expect(mina.PURPOSE).to.equal(KeyConst.PURPOSE)
    expect(mina.COIN_TYPE).to.equal(KeyConst.MINA_COIN_TYPE)
  })

  it('should return the correct hierarchical deterministic path', () => {
    const path = mina.getHierarchicalDeterministicPath({
      accountIndex: 0,
      change: 0,
      index: 0
    })
    expect(path).to.equal(
      `m/${KeyConst.PURPOSE}'/${KeyConst.MINA_COIN_TYPE}'/0'/0/0`
    )
  })

  it('should throw an error when unable to derive private key', async () => {
    // Use a mnemonic that will lead to an error
    const invalidMnemonic = 'invalid mnemonic'
    try {
      await mina.deriveKeyPairByMnemonic(invalidMnemonic, 0, 0, 0)
      expect.fail('Expected error to be thrown')
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).to.equal('Invalid mnemonic')
      } else {
        expect.fail('Caught exception is not an Error instance')
      }
    }
  })

  it('should correctly derive BIP32 Root Key from seed', () => {
    const seed = Buffer.from(expectedSeed, 'hex')
    const actualRootKey = HDKey.fromMasterSeed(seed)
    expect(actualRootKey.privateExtendedKey).to.equal(expectedRootKey)
  })

  it('should return the correct wallet data for a known mnemonic', async () => {
    const expectedWalletData = {
      privateKey: 'EKExKH31gXH7t5KiYxdyEbtgi22vgX6wnqwmcbrANs9nQJt487iN',
      publicKey: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
      address: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
      hdIndex: 0
    }

    const wallet = await mina.deriveKeyPairByMnemonic(mnemonic, 0, 0, 0)
    expect(wallet).to.deep.equal(expectedWalletData)
  })
})
