import { Mina } from '@palladxyz/mina-core'

import {
  deriveEthereumCredentials,
  isEthereumCredential
} from './chains/Ethereum/credentialDerivation'
import {
  EthereumGroupedCredentials,
  EthereumSignatureResult,
  EthereumSpecificArgs
} from './chains/Ethereum/types'
import {
  deriveMinaCredentials,
  isMinaCredential
} from './chains/Mina/credentialDerivation'
import {
  MinaGroupedCredentials,
  MinaKeyConst,
  MinaSignablePayload,
  MinaSignatureResult,
  MinaSpecificArgs
} from './chains/Mina/types'
import {
  deriveStarknetCredentials,
  isStarknetCredential
} from './chains/Starknet/credentialDerivation'
import {
  StarknetGroupedCredentials,
  StarknetSpecificArgs
} from './chains/Starknet/types'

export type ChainKeyConst = MinaKeyConst
export type PayloadTypes = 'transaction' | 'message' | 'fields'

export interface Result<T> {
  success: boolean
  data?: T
  error?: string
}

export type EncryptedKeyPropertyName = 'encryptedSeedBytes'

export enum KeyAgentType {
  InMemory = 'InMemory',
  Ledger = 'Ledger',
  Trezor = 'Trezor'
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

export type GroupedCredentials =
  | MinaGroupedCredentials
  | StarknetGroupedCredentials
  | EthereumGroupedCredentials

export type CredentialMatcher<T extends ChainSpecificArgs> = (
  credential: GroupedCredentials,
  args: T
) => boolean

export const credentialMatchers: Record<Network, CredentialMatcher<any>> = {
  Mina: isMinaCredential as CredentialMatcher<MinaSpecificArgs>,
  Starknet: isStarknetCredential as CredentialMatcher<StarknetSpecificArgs>,
  Ethereum: isEthereumCredential as CredentialMatcher<EthereumSpecificArgs>
  // Add more as needed...
}

export type ChainAddress = Mina.PublicKey | string

/**
 * @returns passphrase used to decrypt private keys
 */
export type GetPassphrase = (noCache?: true) => Promise<Uint8Array>

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
    args: ChainSpecificArgs,
    getPassphrase: GetPassphrase
  ): Promise<ChainSignatureResult>

  deriveKeyPair<T extends ChainSpecificPayload>(
    payload: T,
    args: ChainSpecificArgs,
    passphrase: Uint8Array
  ): Promise<ChainKeyPair>

  deriveCredentials<T extends ChainSpecificPayload>(
    payload: T,
    args: ChainSpecificArgs,
    getPassphrase: GetPassphrase,
    pure?: boolean
  ): Promise<GroupedCredentials>

  exportRootPrivateKey(): Promise<Uint8Array>

  decryptSeed(): Promise<Uint8Array>
}

export enum Network {
  /**
   * Mina network option
   */
  Mina = 'Mina',

  /**
   * Ethereum network option
   */

  Ethereum = 'Ethereum',

  /**
   * Starknet network option
   */
  Starknet = 'Starknet'
}

export type ChainSpecificArgs =
  | MinaSpecificArgs
  | StarknetSpecificArgs
  | EthereumSpecificArgs

export interface ChainSpecificPayload {
  network: Network
  derivePublicKey(
    privateKey: ChainPrivateKey,
    args: ChainSpecificArgs
  ): Promise<ChainPublicKey>
  derivePrivateKey(
    decryptedSeedBytes: Uint8Array,
    args: ChainSpecificArgs
  ): Promise<ChainPrivateKey>
}

export type ChainPublicKey = Mina.PublicKey | string

export type ChainSignatureResult = MinaSignatureResult | EthereumSignatureResult

export type ChainPrivateKey = string | Uint8Array

export type ChainKeyPair = {
  publicKey: ChainPublicKey
  encryptedPrivateKeyBytes: Uint8Array
}

export type DeriveCredentialFunction<T extends ChainSpecificArgs> = (
  args: T,
  publicKey: ChainPublicKey,
  encryptedPrivateKeyBytes: Uint8Array
) => GroupedCredentials

export const credentialDerivers: Record<
  Network,
  DeriveCredentialFunction<any>
> = {
  Mina: deriveMinaCredentials,
  Starknet: deriveStarknetCredentials,
  Ethereum: deriveEthereumCredentials
  // Add more as needed...
}

export type ChainSigningFunction = (
  args: ChainSpecificArgs,
  privateKey: ChainPrivateKey
) => Promise<ChainSignatureResult>

export type ChainSignablePayload = MinaSignablePayload

/*export const chainSigningOperations: Record<string, ChainSigningFunction> = {
  'Mina': MinaSigningOperations,
  'Starknet': () => { throw new Error('Not implemented') },
  'Ethereum': () => { throw new Error('Not implemented') }
  // add other chains here
}*/

export const enum PathLevelIndexes {
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
  INDEX = 4
}
