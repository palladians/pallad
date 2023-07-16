import { wordlist } from '@scure/bip39/wordlists/english'

import { emip3encrypt } from './emip3'
import * as errors from './errors'
import { KeyAgentBase } from './KeyAgentBase'
import {
  GetPassphrase,
  KeyAgent,
  KeyAgentType,
  SerializableInMemoryKeyAgentData
} from './types'
import {
  entropyToSeed,
  joinMnemonicWords,
  mnemonicWordsToEntropy,
  validateMnemonic
} from './util'

export interface InMemoryKeyAgentProps
  extends Omit<SerializableInMemoryKeyAgentData, '__typename'> {
  getPassphrase: GetPassphrase
}

export interface FromBip39MnemonicWordsProps {
  mnemonicWords: string[]
  mnemonic2ndFactorPassphrase?: string
  getPassphrase: GetPassphrase
  accountIndex?: number
}

export const getPassphraseRethrowTypedError = async (
  getPassphrase: GetPassphrase
) => {
  try {
    return await getPassphrase()
  } catch (error) {
    throw new errors.AuthenticationError('Failed to enter passphrase', error)
  }
}

export class InMemoryKeyAgent extends KeyAgentBase implements KeyAgent {
  //readonly #getPassphrase: GetPassphrase

  constructor({ getPassphrase, ...serializableData }: InMemoryKeyAgentProps) {
    super(
      { ...serializableData, __typename: KeyAgentType.InMemory },
      getPassphrase
    )
    //this.#getPassphrase = getPassphrase
  }

  /**
   * Creates an instance of the InMemoryKeyAgent class using mnemonic words.
   *
   * This function first validates the mnemonic words passed to it. It then
   * derives entropy from these words, and subsequently generates a root
   * private key. This root private key is then encrypted using the passphrase
   * returned by the provided `getPassphrase` function.
   *
   * @param props - The properties required to create the InMemoryKeyAgent instance.
   * @param props.getPassphrase - A function to retrieve a passphrase used to encrypt the root private key.
   * @param props.mnemonicWords - An array of strings representing mnemonic words.
   * @param props.mnemonic2ndFactorPassphrase - An optional passphrase that, if provided, is used in generating the root private key.
   *
   * @returns A Promise that resolves to an instance of the InMemoryKeyAgent class.
   *
   * @throws InvalidMnemonicError - If the provided mnemonic words do not form a valid mnemonic.
   * @throws AuthenticationError - If there is a failure in retrieving the passphrase or in decrypting the root private key.
   */
  static async fromBip39MnemonicWords({
    getPassphrase,
    mnemonicWords,
    mnemonic2ndFactorPassphrase = ''
  }: FromBip39MnemonicWordsProps): Promise<InMemoryKeyAgent> {
    const mnemonic = joinMnemonicWords(mnemonicWords)
    const validMnemonic = validateMnemonic(mnemonic, wordlist)
    if (!validMnemonic) throw new errors.InvalidMnemonicError()

    const entropy = mnemonicWordsToEntropy(mnemonicWords)
    const seedBytes = await entropyToSeed(entropy, mnemonic2ndFactorPassphrase)
    const passphrase = await getPassphraseRethrowTypedError(getPassphrase)
    const encryptedSeedBytes = await emip3encrypt(seedBytes, passphrase)

    return new InMemoryKeyAgent({
      encryptedSeedBytes: encryptedSeedBytes,
      knownCredentials: [],
      getPassphrase
    })
  }
}
