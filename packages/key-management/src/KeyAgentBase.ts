import { HDKey } from '@scure/bip32'

import { EthereumSpecificArgs } from './chains/Ethereum'
import { deriveEthereumCredentials } from './chains/Ethereum/credentialDerivation'
import { MinaSignablePayload, MinaSpecificArgs } from './chains/Mina'
import { deriveMinaCredentials } from './chains/Mina/credentialDerivation'
import { MinaSigningOperations } from './chains/Mina/signingOperations'
import {
  deriveStarknetCredentials,
  StarknetSpecificArgs
} from './chains/Starknet'
import * as errors from './errors'
import { KeyDecryptor } from './KeyDecryptor'
import {
  ChainPrivateKey,
  ChainPublicKey,
  ChainSignablePayload,
  ChainSignatureResult,
  ChainSpecificArgs,
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
    this.keyDecryptor = new KeyDecryptor(getPassphrase)
  }

  async decryptSeed(): Promise<Uint8Array> {
    try {
      return await this.keyDecryptor.decryptSeedBytes(this.serializableData)
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
    args: ChainSpecificArgs,
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
      await this.derivePublicCredential<ChainSpecificPayload>(payload, args)

    try {
      if (payload.network === 'Mina') {
        const groupedCredential = deriveMinaCredentials(
          args as MinaSpecificArgs,
          derivedPublicCredential
        )
        if (!pure)
          this.serializableData.credentialSubject.contents = [
            ...this.serializableData.credentialSubject.contents,
            groupedCredential
          ]
        return groupedCredential
      } else if (payload.network === 'Ethereum') {
        const groupedCredential = deriveEthereumCredentials(
          args as EthereumSpecificArgs,
          derivedPublicCredential
        )
        if (!pure)
          this.serializableData.credentialSubject.contents = [
            ...this.serializableData.credentialSubject.contents,
            groupedCredential
          ]
        return groupedCredential
      } else if (payload.network === 'Starknet') {
        const groupedCredential = deriveStarknetCredentials(
          args as StarknetSpecificArgs,
          derivedPublicCredential
        )
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
    payload: T,
    args: ChainSpecificArgs
  ): Promise<ChainPublicKey> {
    // Generate the private key
    const privateKey = await this.#generatePrivateKeyFromSeed(payload, args)
    try {
      return await payload.derivePublicKey(privateKey, args)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async sign<T extends ChainSpecificPayload>(
    payload: T,
    signable: ChainSignablePayload,
    args: ChainSpecificArgs
  ): Promise<ChainSignatureResult> {
    // Generate the private key
    const privateKey = await this.#generatePrivateKeyFromSeed(payload, args)
    try {
      if (args.network === 'Mina') {
        return MinaSigningOperations(
          signable as MinaSignablePayload,
          args as MinaSpecificArgs,
          privateKey as string
        )
      } else {
        throw new Error('Unsupported network')
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async #generatePrivateKeyFromSeed<T extends ChainSpecificPayload>(
    payload: T,
    args: ChainSpecificArgs
  ): Promise<ChainPrivateKey> {
    // Decrypt your seed
    const decryptedSeedBytes = await this.decryptSeed()

    // Perform the specific derivation
    try {
      return await payload.derivePrivateKey(decryptedSeedBytes, args)
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
