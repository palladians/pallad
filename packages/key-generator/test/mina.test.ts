import { expect } from 'vitest'

import { MinaKeyGenerator } from '../src/mina'

describe('MinaKeyGenerator class', () => {
  const mina = new MinaKeyGenerator()
  // currently broken test
  /*it('reverses bytes', () => {
    const originalBytes = Buffer.from('abcd', 'hex')
    const reversedBytes = mina.reverseBytes(originalBytes)
    console.log(reversedBytes.toString('hex'))
    expect(reversedBytes.toString('hex')).toEqual('dcba')
  })*/

  it('gets Hierarchical Deterministic Path', () => {
    const hdPathObject = {
      accountIndex: 1,
      change: 0,
      index: 0
    }
    const hdPath = mina.getHierarchicalDeterministicPath(hdPathObject)
    expect(hdPath).toEqual("m/44'/12586'/1'/0/0")
  })

  it('derives wallet by mnemonic', async () => {
    const mnemonic =
      'habit hope tip crystal because grunt nation idea electric witness alert like'
    const wallet = await mina.deriveKeyPairByMnemonic(mnemonic, 0)

    expect(wallet).toHaveProperty('privateKey')
    expect(wallet).toHaveProperty('publicKey')
    expect(wallet).toHaveProperty('address')
    expect(wallet.hdIndex).toEqual(0)
  })

  it('derives a known keypair', async () => {
    const mnemonic =
      'habit hope tip crystal because grunt nation idea electric witness alert like'
    const wallet = await mina.deriveKeyPairByMnemonic(mnemonic, 0, 0, 0)
    console.log(wallet)
    expect(wallet?.publicKey).toEqual(
      'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'
    )
    expect(wallet?.privateKey).toEqual(
      'EKExKH31gXH7t5KiYxdyEbtgi22vgX6wnqwmcbrANs9nQJt487iN'
    )
  })

  it('derives different wallets for different account numbers', async () => {
    const mnemonic =
      'habit hope tip crystal because grunt nation idea electric witness alert like'
    const wallet1 = await mina.deriveKeyPairByMnemonic(mnemonic, 0, 0, 0)
    const wallet2 = await mina.deriveKeyPairByMnemonic(mnemonic, 1, 0, 0)

    expect(wallet1?.publicKey).not.toEqual(wallet2?.publicKey)
  })
})
