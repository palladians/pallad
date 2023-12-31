import { HDKey } from '@scure/bip32'

import { EthereumSignablePayload, EthereumSigningOperations } from './chains'
import { MinaSignablePayload, MinaSpecificArgs } from './chains/Mina'
import { MinaSigningOperations } from './chains/Mina/signingOperations'
import { emip3encrypt } from './emip3'
import * as errors from './errors'
import { getPassphraseRethrowTypedError } from './InMemoryKeyAgent'
import { KeyDecryptor } from './KeyDecryptor'
import {
  ChainKeyPair,
  ChainPrivateKey,
  ChainSignablePayload,
  ChainSignatureResult,
  ChainSpecificArgs,
  ChainSpecificPayload,
  credentialDerivers,
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
    // TODO: add passphrase as an argument?
    try {
      return await this.keyDecryptor.decryptSeedBytes(this.serializableData)
    } catch (error) {
      throw new Error(`Failed to decrypt root private key: ${error}`)
    }
  }

  async exportRootPrivateKey(): Promise<Uint8Array> {
    // TODO: add passphrase as an argument?
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
    getPassphrase: GetPassphrase,
    pure?: boolean
  ): Promise<GroupedCredentials> {
    const passphrase = await getPassphraseRethrowTypedError(getPassphrase)
    const matcher = credentialMatchers[payload.network]
    if (!matcher) {
      throw new Error(`Unsupported network: ${payload.network}`)
    }

    const knownCredential =
      this.serializableData.credentialSubject.contents.find((credential) =>
        matcher(credential, payload)
      )

    if (knownCredential) return knownCredential

    const derivedKeyPair = await this.deriveKeyPair<ChainSpecificPayload>(
      payload,
      args,
      passphrase
    )

    try {
      const deriveFunction = credentialDerivers[payload.network]
      if (!deriveFunction) {
        throw new Error(`Unsupported network: ${payload.network}`)
      }
      const groupedCredential = deriveFunction(
        args,
        derivedKeyPair.publicKey,
        derivedKeyPair.encryptedPrivateKeyBytes
      )

      if (!pure) {
        this.serializableData.credentialSubject.contents = [
          ...this.serializableData.credentialSubject.contents,
          groupedCredential
        ]
      }
      return groupedCredential
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async deriveKeyPair<T extends ChainSpecificPayload>(
    payload: T,
    args: ChainSpecificArgs,
    passphrase: Uint8Array
  ): Promise<ChainKeyPair> {
    // Generate the private key
    const privateKey = await this.#generatePrivateKeyFromSeed(payload, args)
    const encryptedPrivateKeyBytes = await emip3encrypt(
      Buffer.from(privateKey),
      passphrase
    )
    try {
      const keyPair = {
        publicKey: await payload.derivePublicKey(privateKey, args),
        encryptedPrivateKeyBytes
      }
      return keyPair
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async sign<T extends GroupedCredentials>(
    payload: T,
    signable: ChainSignablePayload,
    args: ChainSpecificArgs
  ): Promise<ChainSignatureResult> {
    const encryptedPrivateKeyBytes = payload.encryptedPrivateKeyBytes
    const decryptedKeyBytes = await this.keyDecryptor.decryptChildPrivateKey(
      encryptedPrivateKeyBytes
    )
    const privateKey = Buffer.from(decryptedKeyBytes).toString()

    try {
      if (args.network === 'Mina') {
        return MinaSigningOperations(
          signable as MinaSignablePayload,
          args as MinaSpecificArgs,
          privateKey as string
        )
      } else if (args.network === 'Ethereum') {
        return EthereumSigningOperations(
          signable as EthereumSignablePayload,
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
