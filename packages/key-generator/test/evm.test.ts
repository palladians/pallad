import { HDKey } from '@scure/bip32'
import { expect } from 'vitest'

import { EVMKeyGenerator } from '../src/evm'
import { KeyConst } from '../src/types'

describe('EVMKeyGenerator', () => {
  let evm: EVMKeyGenerator
  let mnemonic: string
  let expectedSeed: string
  let expectedRootKey: string

  beforeEach(() => {
    evm = new EVMKeyGenerator()
    mnemonic =
      'habit hope tip crystal because grunt nation idea electric witness alert like'
    expectedSeed =
      '9d394cc4a658fe8023c6ddf1a6bea918d717543c8eeb30c115051a58993ba26c9af33b2f7f1bae7aa9428933b9e01c026619ac579a9cf789c39b4e10a4bf7240'
    expectedRootKey =
      'xprv9s21ZrQH143K3kFcvB64V5doa7swe81fWMQuMVWCbKGq835dB3E5isyDhjimNjhrbRm171Q5D4Uy4wKGixKUvsy53hhaBPHDVenm1tsKzdz'
  })

  it('should correctly set constants', () => {
    expect(evm.PURPOSE).to.equal(KeyConst.PURPOSE)
    expect(evm.COIN_TYPE).to.equal(KeyConst.ETHEREUM_COIN_TYPE)
  })

  it('should return the correct hierarchical deterministic path', () => {
    const path = evm.getHierarchicalDeterministicPath({
      accountIndex: 0,
      change: 0,
      index: 0
    })
    expect(path).to.equal(
      `m/${KeyConst.PURPOSE}'/${KeyConst.ETHEREUM_COIN_TYPE}'/0'/0/0`
    )
  })

  it('should throw an error when unable to derive private key', async () => {
    // Use a mnemonic that will lead to an error
    const invalidMnemonic = 'invalid mnemonic'
    try {
      await evm.deriveKeyPairByMnemonic(invalidMnemonic, 0, 0, 0)
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
      privateKey:
        '0xf39d1448532870a18ff898ea561859927ad99606dedeeed11857733688e1b4a0',
      publicKey:
        '0x81467312d5447223eac5e3e5611476a50c42d810c84b4e2e20350c903c6806d46ee3f0283e74c5cbcf5d0ba5d0ce332ef866b1065f5887b0bf46d1cf737dd79e',
      address: '0xA98005e6ce8E62ADf8f9020fa99888E8f107e3C9',
      hdIndex: 0
    }

    const wallet = await evm.deriveKeyPairByMnemonic(mnemonic, 0, 0, 0)
    expect(wallet).to.deep.equal(expectedWalletData)
  })
})
