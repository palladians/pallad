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
