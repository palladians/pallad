import {
  bufferToHex,
  privateToAddress,
  privateToPublic,
  toChecksumAddress
} from '@ethereumjs/util'
import { HDKey } from '@scure/bip32'

import { KeyGenerator, KeyPair } from './keyGenerator'
import { KeyConst } from './types'

export class EVMKeyGenerator extends KeyGenerator {
  PURPOSE = KeyConst.PURPOSE
  COIN_TYPE = KeyConst.ETHEREUM_COIN_TYPE

  async buildWalletFromChildNode(
    childNode: HDKey,
    accountNumber: number
  ): Promise<KeyPair> {
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
