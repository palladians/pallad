import * as bip39 from "@scure/bip39"
import { wordlist } from "@scure/bip39/wordlists/english"

import { emip3encrypt } from "../emip3"

/**
 * A wrapper around the bip39 package function, with default strength applied to produce 24 words
 */
export const mnemonicToWords = (mnemonic: string) => mnemonic.split(" ")
export const generateMnemonicWords = (strength = 256) =>
  mnemonicToWords(bip39.generateMnemonic(wordlist, strength))
export const joinMnemonicWords = (mnenomic: string[]) => mnenomic.join(" ")
export const entropyToMnemonicWords = (entropy: Uint8Array) =>
  mnemonicToWords(bip39.entropyToMnemonic(entropy, wordlist))
export const mnemonicWordsToEntropy = (mnenonic: string[]) =>
  bip39.mnemonicToEntropy(joinMnemonicWords(mnenonic), wordlist)
export const mnemonicToSeed = (mnemonic: string[], passphrase?: string) =>
  bip39.mnemonicToSeedSync(joinMnemonicWords(mnemonic), passphrase)
export const mnemonicToSeedSync = (mnemonic: string, passphrase?: string) =>
  bip39.mnemonicToSeedSync(mnemonic, passphrase)
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
  return seed //root.privateKey ? root.privateKey : Uint8Array
}

/**
 * A wrapper to produce an encrypted seed
 */
export const mnemonicWordsToEncryptedSeed = async (
  mnemonicWords: string[],
  passphrase: Uint8Array,
  mnemonic2ndFactorPassphrase: string,
) => {
  // get seed from mnemonic
  const seed = mnemonicToSeed(mnemonicWords, mnemonic2ndFactorPassphrase)
  // encrypt seed
  const encryptedSeed = await emip3encrypt(seed, passphrase)

  return encryptedSeed
}

export { wordlist }
