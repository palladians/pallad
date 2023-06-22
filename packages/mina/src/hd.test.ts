import { expect } from 'vitest'

import {
  deriveKeyPair,
  generateMnemonic,
  validateMnemonic,
  wordlist
} from './hd'

it('generates new mnemonic', () => {
  const mnemonic = generateMnemonic(wordlist)
  expect(mnemonic.split(' ').length).toEqual(12)
})

it('generates unique mnemonic', () => {
  const mnemonic1 = generateMnemonic(wordlist)
  const mnemonic2 = generateMnemonic(wordlist)
  expect(mnemonic1).not.toEqual(mnemonic2)
})

it('validates mnemonics', () => {
  const validMnemonic =
    'habit hope tip crystal because grunt nation idea electric witness alert like'
  const invalidMnemonic = 'habit hope tip crystal because grunt nation'
  expect(validateMnemonic(validMnemonic, wordlist)).toBeTruthy()
  expect(validateMnemonic(invalidMnemonic, wordlist)).toBeFalsy()
})

it('derives a keypair', async () => {
  const keypair = await deriveKeyPair({
    mnemonic:
      'habit hope tip crystal because grunt nation idea electric witness alert like'
  })
  expect(keypair?.publicKey).toEqual(
    'B62qnHVdf5V7JTiRJDZMXrLNxdcH3xGamp5fUs6uMo5TuwMGHdt1dW2'
  )
})
