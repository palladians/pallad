//import { Mina } from '@palladxyz/mina-core'
//import { HDKey } from '@scure/bip32'
import { wordlist } from '@scure/bip39/wordlists/english'

//import * as bs58check from 'bs58check'
//import Client from 'mina-signer'
//import { SignedLegacy } from 'mina-signer/dist/node/mina-signer/src/TSTypes'
import { emip3encrypt } from './emip3'
import * as errors from './errors'
//import { getRealErrorMsg } from './errors'
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
  async exportRootPrivateKey(): Promise<Uint8Array> {
    try {
      return await this.decryptRootPrivateKey()
      //return await this.decryptCoinTypePrivateKey()
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
    })
  }

  /*async signTransaction(
    accountIx: number,
    addressIx: number,
    transaction: Mina.ConstructedTransaction,
    networkType: Mina.NetworkType
  ): Promise<Mina.SignedTransaction> {
    let signedTransaction: SignedLegacy<Mina.ConstructedTransaction>

    try {
      // Mina network client.
      const minaClient = new Client({ network: networkType })
      // Decrypt your coinType private key first
      const decryptedCoinTypePrivateKeyBytes =
        await this.decryptCoinTypePrivateKey()

      // Create an HDKey from the coinType private key
      const coinTypeKey = HDKey.fromMasterSeed(decryptedCoinTypePrivateKeyBytes)

      // Derive a child key from the given derivation path
      const accountKey = coinTypeKey.deriveChild(accountIx)
      const changeKey = accountKey.deriveChild(0)
      const addressKey = changeKey.deriveChild(addressIx)

      // Convert the childKey's private key into the format expected by the mina client
      if (!addressKey.privateKey) throw new Error('Private key not found')
      const childPrivateKey = addressKey.privateKey
      childPrivateKey[0] &= 0x3f
      const childPrivateKeyReversed = this.reverseBytes(
        new Buffer(childPrivateKey)
      )
      const privateKeyHex = `5a01${childPrivateKeyReversed}`
      const privateKey = bs58check.encode(Buffer.from(privateKeyHex, 'hex'))

      console.log(" ")
      console.log(" ")
      console.log("privateKey Sign Tx", privateKey)
      console.log(" ")
      console.log(" ")
      signedTransaction = minaClient.signTransaction(transaction, privateKey)
    } catch (err) {
      const errorMessage =
        getRealErrorMsg(err) || 'Signing transaction failed.'
      throw new Error(errorMessage)
    }

    return signedTransaction
  }*/

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
}
