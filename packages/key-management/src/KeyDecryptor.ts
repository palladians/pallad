// KeyDecryptor.ts

import { emip3decrypt } from './emip3'
import * as errors from './errors'
import { getPassphraseRethrowTypedError } from './InMemoryKeyAgent'
import { EncryptedKeyPropertyName, SerializableKeyAgentData } from './types'

export class KeyDecryptor {
  private getPassphrase: (noCache?: true) => Promise<Uint8Array>

  constructor(getPassphrase: () => Promise<Uint8Array>) {
    this.getPassphrase = getPassphrase
  }

  async decryptSeedBytes(
    serializableData: SerializableKeyAgentData,
    noCache?: true
  ) {
    return this.decryptSeed(
      'encryptedSeedBytes',
      serializableData,
      'Failed to decrypt seed bytes',
      noCache
    )
  }

  private async decryptSeed(
    keyPropertyName: EncryptedKeyPropertyName,
    serializableData: SerializableKeyAgentData,
    errorMessage: string,
    noCache?: true
  ) {
    const passphrase = await getPassphraseRethrowTypedError(() =>
      this.getPassphrase(noCache)
    )
    let decryptedKeyBytes: Uint8Array
    try {
      decryptedKeyBytes = await emip3decrypt(
        new Uint8Array(serializableData[keyPropertyName]),
        passphrase
      )
    } catch (error) {
      throw new errors.AuthenticationError(errorMessage, error)
    }
    return decryptedKeyBytes
  }
}
