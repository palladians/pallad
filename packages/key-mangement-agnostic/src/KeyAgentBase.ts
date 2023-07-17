import { HDKey } from '@scure/bip32'

import { deriveEthereumCredentials, deriveEthereumPublicAddress } from './chains/Ethereum/credentialDerivation'
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
  GetPassphrase,
  PrivateKey
} from './types'
import { GroupedCredentials, KeyAgent, SerializableKeyAgentData } from './types'
import { deriveEthereumPrivateKey } from './chains/Ethereum/keyDerivation'

export abstract class KeyAgentBase implements KeyAgent {
  readonly serializableData: SerializableKeyAgentData
  private keyDecryptor: KeyDecryptor
  // private #getPassphrase: GetPassphrase

  get knownCredentials(): GroupedCredentials[] {
    return this.serializableData.credentialSubject.contents
  }
  set knownCredentials(credentials: GroupedCredentials[]) {
    this.serializableData.credentialSubject.contents = credentials
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

    const knownCredential =
      this.serializableData.credentialSubject.contents.find((credential) =>
        matcher(credential, payload)
      )

    if (knownCredential) return knownCredential

    const derivedPublicCredential =
      await this.derivePublicCredential<ChainSpecificPayload>(payload)

    try {
      if (payload.network === 'Mina') {
        const groupedCredential = deriveMinaCredentials(
          payload,
          derivedPublicCredential
        )
        if (!pure)
          this.serializableData.credentialSubject.contents = [
            ...this.serializableData.credentialSubject.contents,
            groupedCredential
          ]
        return groupedCredential
      } else if (payload.network === 'Ethereum') {
        const groupedCredential = deriveEthereumCredentials(payload, derivedPublicCredential)
        if (!pure)
          this.serializableData.credentialSubject.contents = [
            ...this.serializableData.credentialSubject.contents,
            groupedCredential
          ]
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
        return deriveMinaPublicKey(payload, privateKey as string)
      } else if (payload.network === 'Ethereum') {
        return await deriveEthereumPublicAddress(privateKey as Uint8Array)
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
        return MinaSigningOperations(payload, privateKey as string)
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
  ): Promise<PrivateKey> {
    // Decrypt your seed
    const decryptedSeedBytes = await this.decryptSeed()

    // Perform the specific derivation
    try {
      if (payload.network === 'Mina') {
        return deriveMinaPrivateKey(payload, decryptedSeedBytes)
      } else if (payload.network === 'Ethereum') {
        return await deriveEthereumPrivateKey(payload, decryptedSeedBytes)
      }
      else {
        throw new Error('Unsupported payload type.')
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
