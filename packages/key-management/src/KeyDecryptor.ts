import { emip3decrypt } from "./emip3"
import * as errors from "./errors"
import type {
  EncryptedKeyPropertyName,
  GetPassphrase,
  SerializableKeyAgentData,
} from "./types"

export class KeyDecryptor {
  #getPassphrase: (noCache?: true) => Uint8Array

  constructor(getPassphrase: GetPassphrase) {
    this.#getPassphrase = getPassphrase
  }

  async decryptChildPrivateKey(
    encryptedPrivateKeyBytes: Uint8Array,
    noCache?: true,
  ): Promise<Uint8Array> {
    const passphrase = this.#getPassphrase(noCache)
    let decryptedKeyBytes: Uint8Array
    try {
      decryptedKeyBytes = await emip3decrypt(
        encryptedPrivateKeyBytes,
        passphrase,
      )
    } catch (error) {
      throw new errors.AuthenticationError(
        "Failed to decrypt child private key",
        error,
      )
    }
    return decryptedKeyBytes
  }

  decryptSeedBytes(serializableData: SerializableKeyAgentData, noCache?: true) {
    return this.decryptSeed(
      "encryptedSeedBytes",
      serializableData,
      "Failed to decrypt seed bytes",
      noCache,
    )
  }

  private async decryptSeed(
    keyPropertyName: EncryptedKeyPropertyName,
    serializableData: SerializableKeyAgentData,
    errorMessage: string,
    noCache?: true,
  ) {
    const passphrase = this.#getPassphrase(noCache)
    let decryptedKeyBytes: Uint8Array
    try {
      const encryptedKeyObj = serializableData[keyPropertyName] as Uint8Array
      const encryptedKeyArray = Object.values(encryptedKeyObj)
      const encryptedKeyBytes = new Uint8Array(encryptedKeyArray)
      decryptedKeyBytes = await emip3decrypt(encryptedKeyBytes, passphrase)
    } catch (error) {
      throw new errors.AuthenticationError(errorMessage, error)
    }
    return decryptedKeyBytes
  }
}
