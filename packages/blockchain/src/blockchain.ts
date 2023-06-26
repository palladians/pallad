export interface HDPath {
  accountIndex: number
  change: number
  index: number
}

export abstract class Blockchain {
  abstract readonly PURPOSE: number
  abstract readonly COIN_TYPE: number

  abstract getHierarchicalDeterministicPath(path: HDPath): string

  abstract deriveWalletByMnemonic(
    mnemonic: string,
    accountNumber: number
  ): Promise<Wallet>

  async deriveKeyPair({
    mnemonic,
    accountNumber = 0
  }: {
    mnemonic: string
    accountNumber?: number
  }) {
    const keys = await this.deriveWalletByMnemonic(mnemonic, accountNumber)
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

export interface Wallet {
  privateKey: string
  publicKey: string
  address: string
  hdIndex: number
}
