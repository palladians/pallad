// KeyDecryptor.ts

import { emip3decrypt } from './emip3'
import * as errors from './errors'
import { getPassphraseRethrowTypedError } from './InMemoryKeyAgent'
import { EncryptedKeyPropertyName, SerializableKeyAgentData } from './types'

export class KeyDecryptor {
  private serializableData: SerializableKeyAgentData
  private getPassphrase: (noCache?: true) => Promise<Uint8Array>

  constructor(
    serializableData: SerializableKeyAgentData,
    getPassphrase: () => Promise<Uint8Array>
  ) {
    this.serializableData = serializableData
    this.getPassphrase = getPassphrase
  }

  async decryptRootPrivateKey(noCache?: true) {
    return this.decryptKey(
      'encryptedRootPrivateKeyBytes',
      'Failed to decrypt root private key',
      noCache
    )
  }

  async decryptCoinTypePrivateKey(noCache?: true) {
    return this.decryptKey(
      'encryptedCoinTypePrivateKeyBytes',
      'Failed to decrypt coin type private key',
      noCache
    )
  }

  private async decryptKey(
    keyPropertyName: EncryptedKeyPropertyName,
    errorMessage: string,
    noCache?: true
  ) {
    const passphrase = await getPassphraseRethrowTypedError(() =>
      this.getPassphrase(noCache)
    )
    let decryptedKeyBytes: Uint8Array
    try {
      decryptedKeyBytes = await emip3decrypt(
        new Uint8Array(this.serializableData[keyPropertyName]),
        passphrase
      )
    } catch (error) {
      throw new errors.AuthenticationError(errorMessage, error)
    }
    //return Buffer.from(decryptedKeyBytes).toString('hex');
    return decryptedKeyBytes
  }
}
