import { Mina } from '@palladxyz/mina-core'

import { isEthereumCredential } from './chains/Ethereum/credentialDerivation'
import {
  EthereumGroupedCredentials,
  EthereumSpecificPayload
} from './chains/Ethereum/types'
import { isMinaCredential } from './chains/Mina/credentialDerivation'
import {
  MinaGroupedCredentials,
  MinaKeyConst,
  MinaPayloadType,
  MinaSignatureResult,
  MinaSpecificPayload
} from './chains/Mina/types'
import { isStarknetCredential } from './chains/Starknet/credentialDerivation'
import {
  StarknetGroupedCredentials,
  StarknetSpecificPayload
} from './chains/Starknet/types'

export type ChainPayloadType = MinaPayloadType
export type ChainKeyConst = MinaKeyConst
export type PayloadTypes = 'transaction' | 'message' | 'fields'

export interface Result<T> {
  success: boolean
  data?: T
  error?: string
}

export type EncryptedKeyPropertyName = 'encryptedSeedBytes' // TODO: Generalise

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

export type CredentialMatcher<T extends ChainSpecificPayload> = (
  credential: GroupedCredentials,
  payload: T
) => boolean

export const credentialMatchers: Record<Network, CredentialMatcher<any>> = {
  Mina: isMinaCredential as CredentialMatcher<MinaSpecificPayload>,
  Starknet: isStarknetCredential as CredentialMatcher<StarknetSpecificPayload>,
  Ethereum: isEthereumCredential as CredentialMatcher<EthereumSpecificPayload>
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
  sign<T extends ChainSpecificPayload>(
    payload: T
  ): Promise<ChainSignatureResult>
  /**
   * @throws AuthenticationError
   */
  derivePublicCredential<T extends ChainSpecificPayload>(
    payload: T
  ): Promise<ChainPublicKey>

  /**
   * Derives an address/credentials from the given payment key derivation path.
   * @param pure If set to true, the key agent will derive a new address without mutating its internal state.
   */
  deriveCredentials<T extends ChainSpecificPayload>(
    payload: T,
    pure?: boolean
  ): Promise<GroupedCredentials>
  /**
   * @throws AuthenticationError
   */
  exportRootPrivateKey(): Promise<Uint8Array>
  /**
   * @throws AuthenticationError
   */
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

export type ChainSpecificPayload =
  | MinaSpecificPayload
  | StarknetSpecificPayload
  | EthereumSpecificPayload

export type ChainPublicKey = Mina.PublicKey | string

export type ChainSignatureResult = MinaSignatureResult

export type PrivateKey = String | Uint8Array

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
