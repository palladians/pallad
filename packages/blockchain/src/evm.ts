import {
  bufferToHex,
  privateToAddress,
  privateToPublic,
  toChecksumAddress
} from '@ethereumjs/util'
import { HDKey } from '@scure/bip32'
import { mnemonicToSeedSync } from '@scure/bip39'

import { Blockchain, HDPath, Wallet } from './blockchain'
import { KeyConst } from './types'

export class EVM extends Blockchain {
  PURPOSE = KeyConst.PURPOSE
  COIN_TYPE = KeyConst.ETHEREUM_COIN_TYPE

  getHierarchicalDeterministicPath(path: HDPath): string {
    const { accountIndex = 0, change = 0, index = 0 } = path
    return `m/${this.PURPOSE}'/${this.COIN_TYPE}'/${accountIndex}'/${change}/${index}`
  }

  async deriveWalletByMnemonic(
    mnemonic: string,
    accountNumber = 0
  ): Promise<Wallet> {
    const seed = mnemonicToSeedSync(mnemonic)
    const masterNode = HDKey.fromMasterSeed(seed)

    const hdPathObject: HDPath = {
      accountIndex: accountNumber,
      change: 0,
      index: 0
    }

    const hdPath = this.getHierarchicalDeterministicPath(hdPathObject)
    const childNode = masterNode.derive(hdPath)
    const privateKey = childNode.privateKey

    if (!privateKey) throw new Error('Unable to derive private key')

    const privateKeyBuffer = Buffer.from(privateKey)

    const publicKey = privateToPublic(privateKeyBuffer)
    const address = toChecksumAddress(
      '0x' + privateToAddress(privateKeyBuffer).toString('hex')
    )

    return {
      privateKey: bufferToHex(privateKeyBuffer),
      publicKey: bufferToHex(publicKey),
      address: address,
      hdIndex: accountNumber
    }
  }
}
