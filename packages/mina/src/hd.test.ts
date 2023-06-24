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
      'habit hope tip crystal because grunt nation idea electric witness alert like',
    accountNumber: 0
  })
  expect(keypair?.publicKey).toEqual(
    'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'
  )
})

it('derives different keypairs for different account numbers', async () => {
  const mnemonic =
    'habit hope tip crystal because grunt nation idea electric witness alert like'
  const keypair1 = await deriveKeyPair({ mnemonic, accountNumber: 0 })
  const keypair2 = await deriveKeyPair({ mnemonic, accountNumber: 1 })
  expect(keypair1?.publicKey).not.toEqual(keypair2?.publicKey)
})
