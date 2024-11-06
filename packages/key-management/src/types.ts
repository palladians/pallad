import type { Mina } from "@palladxyz/mina-core"
import { Network } from "@palladxyz/pallad-core"

import {
  deriveMinaCredentials,
  deriveMinaSessionCredentials,
  isMinaCredential,
} from "./chains/Mina/credentialDerivation"
import {
  type MinaDerivationArgs,
  type MinaGroupedCredentials,
  type MinaKeyConst,
  type MinaSessionCredentials,
  type MinaSignablePayload,
  type MinaSignatureResult,
  type MinaSpecificArgs,
  minaKeyPairDerivationOperations,
} from "./chains/Mina/types"

export type ChainKeyConst = MinaKeyConst
export type PayloadTypes = "transaction" | "message" | "fields"

export interface Result<T> {
  success: boolean
  data?: T
  error?: string
}

export type EncryptedKeyPropertyName = "encryptedSeedBytes"

export enum KeyAgentType {
  InMemory = "InMemory",
  Session = "Sesssion",
  Ledger = "Ledger",
  Trezor = "Trezor",
}

export interface SerializableInMemoryKeyAgentData {
  __typename: KeyAgentType.InMemory
  encryptedSeedBytes: Uint8Array
  type: string[]
  id: string
  issuer: string
  issuanceDate: string
  credentialSubject: {
    id: string
    contents: GroupedCredentials[]
  }
}

export type SerializableKeyAgentData = SerializableInMemoryKeyAgentData
export type SerializableSessionKeyAgentData = {
  __typename: KeyAgentType.Session
  type: string[]
  id: string
  issuer: string
  issuanceDate: string
  credentialSubject: {
    id: string
    contents: SessionGroupedCredentials[]
  }
}
export type GroupedCredentials = MinaGroupedCredentials

export type SessionGroupedCredentials = MinaSessionCredentials

export type CredentialMatcher<T extends ChainDerivationArgs> = (
  credential: GroupedCredentials,
  args: T,
) => boolean

export const credentialMatchers: Record<Network, CredentialMatcher<any>> = {
  Mina: isMinaCredential as CredentialMatcher<MinaDerivationArgs>,
}

// other new ones that work
export interface KeyPairDerivationOperations<T> {
  derivePublicKey: (privateKey: Uint8Array) => Promise<string>
  derivePrivateKey: (
    decryptedSeedBytes: Uint8Array,
    args: T,
  ) => Promise<Uint8Array>
}

export const createChainDerivationOperationsProvider = (
  args: ChainDerivationArgs,
) => {
  const derivePublicKey = (privateKey: Uint8Array) => {
    if (args.network === Network.Mina) {
      return minaKeyPairDerivationOperations.derivePublicKey(privateKey)
    }
    throw new Error(`Unsupported network in args: ${args}`)
  }

  const derivePrivateKey = (decryptedSeedBytes: Uint8Array) => {
    if (args.network === Network.Mina) {
      return minaKeyPairDerivationOperations.derivePrivateKey(
        decryptedSeedBytes,
        args,
      )
    }
    throw new Error(`Unsupported network in args: ${args}`)
  }

  return {
    derivePublicKey,
    derivePrivateKey,
  }
}

export function isDerivationArgsForNetwork<T extends ChainDerivationArgs>(
  args: ChainDerivationArgs,
  network: Network,
): args is T {
  return args.network === network
}

export type ChainAddress = Mina.PublicKey | string

/**
 * @returns passphrase used to decrypt private keys
 */
export type GetPassphrase = (noCache?: boolean) => Uint8Array

export interface AccountKeyDerivationPath {
  account_ix: number
}
export interface AddressKeyDerivationPath {
  address_ix: number
}

export interface KeyAgent {
  get serializableData(): SerializableKeyAgentData
  get knownCredentials(): GroupedCredentials[]
  set knownCredentials(credentials: GroupedCredentials[])
  /**
   * generic sign
   */
  sign<T extends GroupedCredentials>(
    payload: T,
    signable: ChainSignablePayload,
    args: ChainOperationArgs,
    getPassphrase: GetPassphrase,
  ): Promise<ChainSignatureResult>

  deriveKeyPair(
    args: ChainDerivationArgs,
    passphrase: Uint8Array,
  ): Promise<ChainKeyPair>

  deriveCredentials(
    args: ChainDerivationArgs,
    getPassphrase: GetPassphrase,
    pure?: boolean,
  ): Promise<GroupedCredentials>

  exportRootPrivateKey(getPassphrase: GetPassphrase): Promise<Uint8Array>

  decryptSeed(getPassphrase: GetPassphrase): Promise<Uint8Array>
}

export interface SessionKeyAgent {
  sign<T extends SessionGroupedCredentials>(
    payload: T,
    signable: ChainSignablePayload,
    args: ChainOperationArgs,
  ): Promise<ChainSignatureResult>

  deriveKeyPair(
    args: ChainDerivationArgs,
    passphrase: Uint8Array,
  ): Promise<SessionChainKeyPair>

  deriveCredentials(
    args: ChainDerivationArgs,
    pure?: boolean,
  ): Promise<SessionGroupedCredentials>
}

export type ChainDerivationArgs = MinaDerivationArgs

export type ChainSpecificArgs = MinaSpecificArgs

export type ChainOperationArgs = {
  operation: string
  network: "Mina"
  networkType?: Mina.NetworkType
}

export interface ChainSpecificPayload {
  network: Network
  derivePublicKey(
    privateKey: ChainPrivateKey,
    args: ChainDerivationArgs,
  ): Promise<ChainPublicKey>
  derivePrivateKey(
    decryptedSeedBytes: Uint8Array,
    args: ChainDerivationArgs,
  ): Promise<ChainPrivateKey>
}

export type ChainPublicKey = Mina.PublicKey | string

export type ChainSignatureResult = MinaSignatureResult

export type ChainPrivateKey = Uint8Array

export type ChainKeyPair = {
  publicKey: ChainPublicKey
  encryptedPrivateKeyBytes: Uint8Array
}

export type SessionChainKeyPair = {
  publicKey: ChainPublicKey
  privateKeyBytes: Uint8Array
}

export type DeriveCredentialFunction<T extends ChainDerivationArgs> = (
  args: T,
  publicKey: ChainPublicKey,
  encryptedPrivateKeyBytes: Uint8Array,
) => GroupedCredentials

export const credentialDerivers: Record<
  Network,
  DeriveCredentialFunction<any>
> = {
  Mina: deriveMinaCredentials,
}

export type DeriveSessionCredentialFunction<T extends ChainDerivationArgs> = (
  args: T,
  publicKey: ChainPublicKey,
  encryptedPrivateKeyBytes: Uint8Array,
) => SessionGroupedCredentials

export const credentialSessionDerivers: Record<
  Network,
  DeriveSessionCredentialFunction<any>
> = {
  Mina: deriveMinaSessionCredentials,
}

export type ChainSigningFunction = (
  args: ChainOperationArgs, // TODO: chain
  privateKey: ChainPrivateKey,
) => Promise<ChainSignatureResult>

export type ChainSignablePayload = MinaSignablePayload

export enum PathLevelIndexes {
  /**
   * Index of the PURPOSE level in a BIP44 path
   */
  PURPOSE = 0,

  /**
   * Index of the COIN_TYPE level in a BIP44 path
   */
  COIN_TYPE = 1,

  /**
   * Index of the ACCOUNT level in a BIP44 path
   */
  ACCOUNT = 2,

  /**
   * Index of the CHANGE level in a BIP44 path
   */
  CHANGE = 3,

  /**
   * Index of the INDEX level in a BIP44 path
   */
  INDEX = 4,
}
