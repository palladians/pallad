import { HDKey } from '@scure/bip32'
import { mnemonicToSeedSync } from '@scure/bip39'

export interface HDPathIndices {
  accountIndex: number
  change: number
  index: number
}

export interface KeyPair {
  privateKey: string
  publicKey: string
  address: string
  hdIndex: number
}

export abstract class KeyGenerator {
  abstract readonly PURPOSE: number
  abstract readonly COIN_TYPE: number

  getHierarchicalDeterministicPath(path: HDPathIndices): string {
    const { accountIndex = 0, change = 0, index = 0 } = path
    return `m/${this.PURPOSE}'/${this.COIN_TYPE}'/${accountIndex}'/${change}/${index}`
  }

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

  async deriveMasterNodeFromMnemonic(mnemonic: string): Promise<HDKey> {
    const seed = mnemonicToSeedSync(mnemonic)
    return HDKey.fromMasterSeed(seed)
  }

  async deriveWalletByMnemonic(
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
    return this.buildWalletFromChildNode(childNode, accountNumber)
  }

  abstract buildWalletFromChildNode(
    childNode: HDKey,
    accountNumber: number
  ): Promise<KeyPair>

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
    const keys = await this.deriveWalletByMnemonic(
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
