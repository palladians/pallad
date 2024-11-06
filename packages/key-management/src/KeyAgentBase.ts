import { HDKey } from "@scure/bip32"

import { bytesToUtf8 } from "@noble/ciphers/utils"
import { utf8ToBytes } from "@noble/hashes/utils"
import { KeyDecryptor } from "./KeyDecryptor"
import type { MinaSignablePayload } from "./chains/Mina"
import { MinaSigningOperations } from "./chains/Mina/signingOperations"
import { emip3encrypt } from "./emip3"
import * as errors from "./errors"
import {
  type ChainDerivationArgs,
  type ChainKeyPair,
  type ChainOperationArgs,
  type ChainPrivateKey,
  type ChainSignablePayload,
  type ChainSignatureResult,
  type GetPassphrase,
  createChainDerivationOperationsProvider,
  credentialDerivers,
  credentialMatchers,
} from "./types"
import type {
  GroupedCredentials,
  KeyAgent,
  SerializableKeyAgentData,
} from "./types"

export abstract class KeyAgentBase implements KeyAgent {
  readonly serializableData: SerializableKeyAgentData
  private keyDecryptor: KeyDecryptor

  get knownCredentials(): GroupedCredentials[] {
    return this.serializableData.credentialSubject.contents
  }
  set knownCredentials(credentials: GroupedCredentials[]) {
    this.serializableData.credentialSubject.contents = credentials
  }

  constructor(
    serializableData: SerializableKeyAgentData,
    getPassphrase: GetPassphrase,
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
        "Failed to export root private key",
        error,
      )
    }
  }

  async deriveCredentials(
    args: ChainDerivationArgs,
    getPassphrase: GetPassphrase,
    pure?: boolean,
  ): Promise<GroupedCredentials> {
    const passphrase = getPassphrase()
    const matcher = credentialMatchers[args.network]
    if (!matcher) {
      throw new Error(`Unsupported network: ${args.network}`)
    }

    const knownCredential =
      this.serializableData.credentialSubject.contents.find((credential) =>
        matcher(credential, args),
      )

    if (knownCredential) return knownCredential

    const derivedKeyPair = await this.deriveKeyPair(args, passphrase)

    try {
      const deriveFunction = credentialDerivers[args.network]
      if (!deriveFunction) {
        throw new Error(`Unsupported network: ${args.network}`)
      }
      const groupedCredential = deriveFunction(
        args,
        derivedKeyPair.publicKey,
        derivedKeyPair.encryptedPrivateKeyBytes,
      )

      if (!pure) {
        this.serializableData.credentialSubject.contents = [
          ...this.serializableData.credentialSubject.contents,
          groupedCredential,
        ]
      }
      return groupedCredential
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async deriveKeyPair(
    args: ChainDerivationArgs,
    passphrase: Uint8Array,
  ): Promise<ChainKeyPair> {
    // Generate the private key
    let privateKey: ChainPrivateKey | null
    privateKey = await this.#generatePrivateKeyFromSeed(args)
    const encryptedPrivateKeyBytes = await emip3encrypt(privateKey, passphrase)
    const provider = createChainDerivationOperationsProvider(args)

    try {
      const keyPair = {
        publicKey: await provider.derivePublicKey(privateKey),
        encryptedPrivateKeyBytes,
      }
      // Overwrite and nullify the privateKey
      privateKey = utf8ToBytes("0".repeat(privateKey.length))
      privateKey = null

      return keyPair
    } catch (error) {
      // Overwrite and nullify the privateKey
      if (privateKey) {
        privateKey = utf8ToBytes("0".repeat(privateKey.length))
        privateKey = null
      }
      console.error(error)
      throw error
    }
  }

  async sign<T extends GroupedCredentials>(
    payload: T,
    signable: ChainSignablePayload,
    args: ChainOperationArgs,
  ): Promise<ChainSignatureResult> {
    const decryptedKeyBytes = await this.keyDecryptor.decryptChildPrivateKey(
      new Uint8Array(Object.values(payload.encryptedPrivateKeyBytes)),
    )

    let privateKey: string | null = bytesToUtf8(decryptedKeyBytes)

    try {
      let result
      if (args.network === "Mina") {
        result = MinaSigningOperations(
          signable as MinaSignablePayload,
          args,
          privateKey,
        )
      } else {
        throw new Error("Unsupported network")
      }

      // Overwrite and nullify the privateKey
      privateKey = "0".repeat(privateKey.length)
      privateKey = null

      return result
    } catch (error) {
      // Overwrite and nullify the privateKey
      if (privateKey) {
        privateKey = "0".repeat(privateKey.length)
        privateKey = null
      }
      console.error(error)
      throw error
    }
  }

  async #generatePrivateKeyFromSeed<T extends ChainDerivationArgs>(
    args: T,
  ): Promise<ChainPrivateKey> {
    const decryptedSeedBytes = await this.decryptSeed()
    const provider = createChainDerivationOperationsProvider(args)

    return await provider.derivePrivateKey(decryptedSeedBytes)
  }
}
