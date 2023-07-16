import { HDKey } from '@scure/bip32'

import {
  deriveMinaCredentials,
  deriveMinaPublicKey
} from './chains/Mina/credentialDerivation'
import { deriveMinaPrivateKey } from './chains/Mina/keyDerivation'
import { MinaSigningOperations } from './chains/Mina/signingOperations'
import * as errors from './errors'
import { KeyDecryptor } from './KeyDecryptor'
import {
  ChainPublicKey,
  ChainSignatureResult,
  ChainSpecificPayload,
  credentialMatchers,
  GetPassphrase
} from './types'
import { GroupedCredentials, KeyAgent, SerializableKeyAgentData } from './types'

export abstract class KeyAgentBase implements KeyAgent {
  readonly serializableData: SerializableKeyAgentData
  private keyDecryptor: KeyDecryptor
  // private #getPassphrase: GetPassphrase

  get knownCredentials(): GroupedCredentials[] {
    return this.serializableData.knownCredentials
  }
  set knownCredentials(credentials: GroupedCredentials[]) {
    this.serializableData.knownCredentials = credentials
  }

  constructor(
    serializableData: SerializableKeyAgentData,
    getPassphrase: GetPassphrase
  ) {
    this.serializableData = serializableData
    this.keyDecryptor = new KeyDecryptor(serializableData, getPassphrase)
  }

  async decryptSeed(): Promise<Uint8Array> {
    try {
      return await this.keyDecryptor.decryptSeedBytes()
    } catch (error) {
      throw new Error(`Failed to decrypt root private key: ${error}`)
    }
  }

  async exportRootPrivateKey(): Promise<Uint8Array> {
    try {
      const decryptedSeedBytes = await this.decryptSeed()
      const rootKey = HDKey.fromMasterSeed(decryptedSeedBytes)
      return rootKey.privateKey ? rootKey.privateKey : new Uint8Array([])
    } catch (error) {
      throw new errors.AuthenticationError(
        'Failed to export root private key',
        error
      )
    }
  }

  async deriveCredentials<T extends ChainSpecificPayload>(
    payload: T,
    pure?: boolean
  ): Promise<GroupedCredentials> {
    const matcher = credentialMatchers[payload.network]
    if (!matcher) {
      throw new Error(`Unsupported network: ${payload.network}`)
    }

    const knownCredential = this.knownCredentials.find((credential) =>
      matcher(credential, payload)
    )

    if (knownCredential) return knownCredential

    const derivedPublicCredential =
      await this.derivePublicCredential<ChainSpecificPayload>(payload)

    try {
      if (payload.network === 'Mina') {
        const groupedCredential = await deriveMinaCredentials(
          payload,
          derivedPublicCredential
        )
        if (!pure)
          this.knownCredentials = [...this.knownCredentials, groupedCredential]
        return groupedCredential
      } else {
        throw new Error('Unsupported network')
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async derivePublicCredential<T extends ChainSpecificPayload>(
    payload: T
  ): Promise<ChainPublicKey> {
    // Generate the private key
    const privateKey = await this.#generatePrivateKeyFromSeed(payload)
    try {
      if (payload.network === 'Mina') {
        return deriveMinaPublicKey(payload, privateKey)
      } else {
        throw new Error('Unsupported network')
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async sign<T extends ChainSpecificPayload>(
    payload: T
  ): Promise<ChainSignatureResult> {
    // Generate the private key
    const privateKey = await this.#generatePrivateKeyFromSeed(payload)
    try {
      if (payload.network === 'Mina') {
        return MinaSigningOperations(payload, privateKey)
      } else {
        throw new Error('Unsupported network')
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async #generatePrivateKeyFromSeed<T extends ChainSpecificPayload>(
    payload: T
  ): Promise<string> {
    // Decrypt your seed
    const decryptedSeedBytes = await this.decryptSeed()

    // Perform the specific derivation
    try {
      if (payload.network === 'Mina') {
        return deriveMinaPrivateKey(payload, decryptedSeedBytes)
      } else {
        throw new Error('Unsupported payload type.')
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
