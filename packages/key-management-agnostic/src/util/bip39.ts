//import * as bip32 from '@scure/bip32'
import * as bip39 from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english.js'

/**
 * A wrapper around the bip39 package function, with default strength applied to produce 24 words
 */
export const mnemonicToWords = (mnemonic: string) => mnemonic.split(' ')
export const generateMnemonicWords = (strength = 256) =>
  mnemonicToWords(bip39.generateMnemonic(wordlist, strength))
export const joinMnemonicWords = (mnenomic: string[]) => mnenomic.join(' ')
export const entropyToMnemonicWords = (entropy: Uint8Array) =>
  mnemonicToWords(bip39.entropyToMnemonic(entropy, wordlist))
export const mnemonicWordsToEntropy = (mnenonic: string[]) =>
  bip39.mnemonicToEntropy(joinMnemonicWords(mnenonic), wordlist)
export const mnemonicToSeed = (mnemonic: string[], passphrase?: string) =>
  bip39.mnemonicToSeedSync(joinMnemonicWords(mnemonic), passphrase)
/**
 * A wrapper around the bip39 package function
 */
export const validateMnemonic = bip39.validateMnemonic

/**
 *  A wrapper to produce a root from entropy
 */
export const entropyToSeed = (entropy: Uint8Array, passphrase?: string) => {
  // Convert entropy to mnemonic words
  const mnemonicWords = entropyToMnemonicWords(entropy)
  // Get seed from mnemonic words plus the passphrase
  const seed = mnemonicToSeed(mnemonicWords, passphrase)
  // Get root key from seed
  //const root = bip32.HDKey.fromMasterSeed(seed)
  // Return unencrypted root key bytes
  return seed //root.privateKey ? root.privateKey : Buffer.from([])
}

export {wordlist}