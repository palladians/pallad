import { wordlist } from '@scure/bip39/wordlists/english'

import { emip3encrypt } from './emip3'
import * as errors from './errors'
import { KeyAgentBase } from './KeyAgentBase'
import { KeyDecryptor } from './KeyDecryptor'
import {
  GetPassphrase,
  KeyAgent,
  KeyAgentType,
  SerializableInMemoryKeyAgentData
} from './types'
import {
  deriveCoinTypePrivateKey,
  entropyToRootKey,
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
  readonly #getPassphrase: GetPassphrase
  private keyDecryptor: KeyDecryptor

  constructor({ getPassphrase, ...serializableData }: InMemoryKeyAgentProps) {
    super({ ...serializableData, __typename: KeyAgentType.InMemory })
    this.#getPassphrase = getPassphrase
    this.keyDecryptor = new KeyDecryptor(
      { ...serializableData, __typename: KeyAgentType.InMemory },
      getPassphrase
    )
  }
  /*
  async exportRootPrivateKey(): Promise<string> {
    return await this.#decryptRootPrivateKey(true)
  }*/
  async exportRootPrivateKey(): Promise<Uint8Array> {
    try {
      return await this.decryptRootPrivateKey()
    } catch (error) {
      throw new errors.AuthenticationError(
        'Failed to export root private key',
        error
      )
    }
  }

  /**
   * Creates an instance of the InMemoryKeyAgent class using mnemonic words.
   *
   * This function first validates the mnemonic words passed to it. It then
   * derives entropy from these words, and subsequently generates a root
   * private key. This root private key is then encrypted using the passphrase
   * returned by the provided `getPassphrase` function.
   *
   * Finally, it uses the root private key to derive a coin-type-specific
   * private key and returns an InMemoryKeyAgent instance with the encrypted
   * root private key and the derived coin type private key.
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
    const rootPrivateKeyBytes = await entropyToRootKey(
      entropy,
      mnemonic2ndFactorPassphrase
    )
    const passphrase = await getPassphraseRethrowTypedError(getPassphrase)
    const encryptedRootPrivateKeyBytes = await emip3encrypt(
      rootPrivateKeyBytes,
      passphrase
    )

    const coinTypePrivateKeyBytes = await deriveCoinTypePrivateKey({
      rootPrivateKey: rootPrivateKeyBytes
    })
    const encryptedCoinTypePrivateKeyBytes = await emip3encrypt(
      coinTypePrivateKeyBytes,
      passphrase
    )

    return new InMemoryKeyAgent({
      encryptedRootPrivateKeyBytes: encryptedRootPrivateKeyBytes,
      encryptedCoinTypePrivateKeyBytes: encryptedCoinTypePrivateKeyBytes,
      knownCredentials: [],
      getPassphrase
      /*decryptCoinTypePrivateKey() {
        return this.decryptCoinTypePrivateKey()
      },
      decryptRootPrivateKey() {
        return this.decryptRootPrivateKey()
      }*/
    })
  }

  async decryptRootPrivateKey() {
    try {
      return await this.keyDecryptor.decryptRootPrivateKey()
    } catch (error) {
      throw new Error(`Failed to decrypt root private key: ${error}`)
    }
  }

  async decryptCoinTypePrivateKey() {
    try {
      return await this.keyDecryptor.decryptCoinTypePrivateKey()
    } catch (error) {
      throw new Error(`Failed to decrypt coin type private key: ${error}`)
    }
  }

  /**
   * This method decrypts the root private key.
   * It first prompts the user for a passphrase and uses it to decrypt the key.
   * @param noCache A flag to indicate whether to use a cached passphrase or not
   * @returns A Promise that resolves to the decrypted private key
   * @throws AuthenticationError
   */
  /*async #decryptRootPrivateKey(noCache?: true) {
    const passphrase = await getPassphraseRethrowTypedError(() =>
      this.#getPassphrase(noCache)
    )
    let decryptedRootKeyBytes: Uint8Array
    try {
      decryptedRootKeyBytes = await emip3decrypt(
        new Uint8Array(
          (
            this.serializableData as SerializableInMemoryKeyAgentData
          ).encryptedRootPrivateKeyBytes
        ),
        passphrase
      )
    } catch (error) {
      throw new errors.AuthenticationError(
        'Failed to decrypt root private key',
        error
      )
    }
    return Buffer.from(decryptedRootKeyBytes).toString('hex')
  }*/
}
