import { Mina } from '@palladxyz/mina-core'

export type EncryptedKeyPropertyName = 'encryptedSeedBytes' // TODO: Generalise

export enum KeyAgentType {
  InMemory = 'InMemory',
  Ledger = 'Ledger',
  Trezor = 'Trezor'
}

export interface SerializableKeyAgentDataBase {
  knownCredentials: GroupedCredentials[]
}

export interface SerializableInMemoryKeyAgentData
  extends SerializableKeyAgentDataBase {
  __typename: KeyAgentType.InMemory
  encryptedSeedBytes: Uint8Array
}

export interface GroupedCredentials {
  chain: Network
  addressIndex: number
  accountIndex: number
  address: Mina.PublicKey
}

export type SerializableKeyAgentData = SerializableInMemoryKeyAgentData

/**
 * @returns passphrase used to decrypt private keys
 */
export type GetPassphrase = (noCache?: true) => Promise<Uint8Array>

export interface AccountKeyDerivationPath {
  account_ix: number
}
export interface AccountAddressDerivationPath {
  address_ix: number
}

export interface KeyAgent {
  get serializableData(): SerializableKeyAgentData
  get knownCredentials(): GroupedCredentials[]
  set knownCredentials(credentials: GroupedCredentials[])

  /**
   * @throws AuthenticationError
   */
  signMessage(accountDerivationPath: AccountKeyDerivationPath, addressDerivationPath: AccountAddressDerivationPath, message: Mina.MessageBody, networkType: Mina.NetworkType): Promise<Mina.SignedMessage>;
  /**
   * @throws AuthenticationError
   */
  signTransaction(
    accountDerivationPath: AccountKeyDerivationPath,
    addressDerivationPath: AccountAddressDerivationPath,
    transaction: Mina.ConstructedTransaction,
    networkType: Mina.NetworkType
  ): Promise<Mina.SignedTransaction>
  /**
   * generic sign
   */
  sign<T>(
    accountDerivationPath: AccountKeyDerivationPath,
    addressDerivationPath: AccountAddressDerivationPath,
    payload: T,
    networkType: Mina.NetworkType,
  ): Promise<Mina.SignedTransaction | Mina.SignedMessage> 
  /**
   * @throws AuthenticationError
   */
  derivePublicKey(
    accountDerivationPath: AccountKeyDerivationPath,
    addressDerivationPath: AccountAddressDerivationPath,
    network: Network,
    networkType: Mina.NetworkType
  ): Promise<Mina.PublicKey>

  reverseBytes(bytes: Buffer): Buffer
  /**
   * Derives an address/credentials from the given payment key derivation path.
   *
   * @param paymentKeyDerivationPath The payment key derivation path.
   * @param stakeKeyDerivationIndex The stake key index. This field is optional. If not provided it defaults to index 0.
   * @param pure If set to true, the key agent will derive a new address without mutating its internal state.
   */
  deriveCredentials(
    accountIndex: AccountKeyDerivationPath,
    addressIndex: AccountAddressDerivationPath,
    network: Network,
    networkType: Mina.NetworkType,
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

/**
 * This enumeration holds the different types of blockchain networks.
 *
 * @remarks
 * Add any new networks to this enum as part of the {@link pallad#key-generator | key-generator subsystem}.
 *
 * @beta
 */
// TODO: Generalise
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
   * Polygon network option
   */
  Polygon = 'Polygon'
  // Add more networks here
}

/**
 * This enumeration holds the different types of Mina networks.
 *
 * @remarks
 * Add any new Mina networks to this enum as part of the {@link pallad#key-generator | key-generator subsystem}.
 *
 * @beta
 */

export enum MinaNetwork {
  /**
   * Mina mainnet network option
   */
  Mainnet = 'Mainnet',
  /**
   * Mina devnet network option
   */
  Devnet = 'Devnet',
  /**
   * Mina berkeley network option
   */
  Berkeley = 'Berkeley'
}

/**
 * Constants associated with generating keys for different types of blockchain networks.
 *
 * @remarks
 * If a new network is added to the {@link Network} enum, the respective COIN_TYPE should be added here.
 *
 * @beta
 */
export const enum KeyConst {
  /**
   * Constant value used for defining the purpose in a BIP44 path
   */
  PURPOSE = 44,

  /**
   * COIN_TYPE value for Mina network
   */
  MINA_COIN_TYPE = 12586,

  /**
   * COIN_TYPE value for Ethereum network
   */
  ETHEREUM_COIN_TYPE = 60,

  /**
   * COIN_TYPE value for Polygon network
   */
  POLYGON_COIN_TYPE = 137
  // Add more COIN_TYPEs here
}

/**
 * Indexes of the different levels in a BIP44 path.
 *
 * @remarks
 * These indexes are used when building a BIP44 path for key generation.
 *
 * @beta
 */
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
