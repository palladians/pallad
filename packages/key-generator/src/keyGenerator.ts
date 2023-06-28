import { HDKey } from '@scure/bip32'
import { mnemonicToSeedSync } from '@scure/bip39'
export { generateMnemonic, validateMnemonic } from '@scure/bip39'
export { wordlist } from '@scure/bip39/wordlists/english.js'

/**
 * Interface representing the HD (Hierarchical Deterministic) path indices.
 *
 * @property accountIndex - Account index in the HD path
 * @property change - Change index in the HD path
 * @property index - Index in the HD path
 */
export interface HDPathIndices {
  accountIndex: number
  change: number
  index: number
}

/**
 * Interface representing a key pair, including the private key, public key, address, and the hierarchical deterministic index.
 *
 * @property privateKey - The private key
 * @property publicKey - The public key
 * @property address - The address associated with the key pair
 * @property hdIndex - The hierarchical deterministic index
 */
export interface KeyPair {
  privateKey: string
  publicKey: string
  address: string
  hdIndex: number
}

/**
 * Abstract class for generating keys.
 *
 * @remarks
 * The class should be extended by any key generator implementation.
 * It provides basic methods for generating keys using HD (Hierarchical Deterministic) paths.
 */
export abstract class KeyGenerator {
  abstract readonly PURPOSE: number
  abstract readonly COIN_TYPE: number

  /**
   * Returns the hierarchical deterministic (HD) path for a given HD path indices.
   *
   * @param path - The HD path indices
   * @returns The HD path string
   */
  getHierarchicalDeterministicPath(path: HDPathIndices): string {
    const { accountIndex = 0, change = 0, index = 0 } = path
    return `m/${this.PURPOSE}'/${this.COIN_TYPE}'/${accountIndex}'/${change}/${index}`
  }

  /**
   * Returns an object representing the HD (Hierarchical Deterministic) path.
   *
   * @param accountNumber - The account number
   * @param changeIndex - The change index
   * @param addressIndex - The address index
   * @returns An object representing the HD path
   */
  getHDPathObject(
    accountNumber = 0,
    changeIndex = 0,
    addressIndex = 0
  ): HDPathIndices {
    return {
      accountIndex: accountNumber,
      change: changeIndex,
      index: addressIndex
    }
  }

  /**
   * Derives the master node from a given mnemonic.
   *
   * @param mnemonic - The mnemonic
   * @returns The derived HDKey
   */
  async deriveMasterNodeFromMnemonic(mnemonic: string): Promise<HDKey> {
    const seed = mnemonicToSeedSync(mnemonic)
    return HDKey.fromMasterSeed(seed)
  }

  /**
   * Derives a key pair from a given mnemonic, account number, change index, and address index.
   *
   * @param mnemonic - The mnemonic
   * @param accountNumber - The account number
   * @param changeIndex - The change index (optional)
   * @param addressIndex - The address index (optional)
   * @returns The derived key pair
   */
  async deriveKeyPairByMnemonic(
    mnemonic: string,
    accountNumber: number,
    changeIndex?: number,
    addressIndex?: number
  ): Promise<KeyPair> {
    const masterNode = await this.deriveMasterNodeFromMnemonic(mnemonic)
    const hdPathObject = this.getHDPathObject(
      accountNumber,
      changeIndex,
      addressIndex
    )
    const hdPath = this.getHierarchicalDeterministicPath(hdPathObject)
    const childNode = masterNode.derive(hdPath)
    return this.buildKeyPairFromChildNode(childNode, accountNumber)
  }

  /**
   * Builds a key pair from a given child node and account number.
   *
   * @param childNode - The child node
   * @param accountNumber - The account number
   * @returns The key pair
   */
  abstract buildKeyPairFromChildNode(
    childNode: HDKey,
    accountNumber: number
  ): Promise<KeyPair>

  /**
   * Derives a key pair from the given parameters.
   *
   * @param mnemonic - The mnemonic
   * @param accountNumber - The account number (optional)
   * @param changeIndex - The change index (optional)
   * @param addressIndex - The address index (optional)
   * @returns The derived key pair or null if the key pair could not be derived
   */
  async deriveKeyPair({
    mnemonic,
    accountNumber = 0,
    changeIndex = 0,
    addressIndex = 0
  }: {
    mnemonic: string
    accountNumber?: number
    changeIndex?: number
    addressIndex?: number
  }) {
    const keys = await this.deriveKeyPairByMnemonic(
      mnemonic,
      accountNumber,
      changeIndex,
      addressIndex
    )
    if (keys) {
      const { privateKey, publicKey, address } = keys
      return {
        privateKey,
        publicKey,
        address,
        mnemonic
      }
    }
    return null
  }
}
