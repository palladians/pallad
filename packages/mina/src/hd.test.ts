import { deriveKeyPair, getMnemonic } from './hd'
import { expect } from 'vitest'

it('generates new mnemonic', () => {
  const mnemonic = getMnemonic()
  expect(mnemonic.split(' ').length).toEqual(12)
})

it('generates unique mnemonic', () => {
  const mnemonic1 = getMnemonic()
  const mnemonic2 = getMnemonic()
  expect(mnemonic1).not.toEqual(mnemonic2)
})

it('derives a keypair', async () => {
  const keypair = await deriveKeyPair({
    mnemonic: 'habit hope tip crystal because grunt nation idea electric witness alert like'
  })
  expect(keypair.publicKey).toEqual('B62qnHVdf5V7JTiRJDZMXrLNxdcH3xGamp5fUs6uMo5TuwMGHdt1dW2')
})
