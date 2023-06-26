import { HDKey } from '@scure/bip32'
import bs58check from 'bs58check'
import { Buffer } from 'buffer'
import Client from 'mina-signer'

import { KeyGenerator, KeyPair } from './keyGenerator'
import { KeyConst } from './types'

export class MinaKeyGenerator extends KeyGenerator {
  PURPOSE = KeyConst.PURPOSE
  COIN_TYPE = KeyConst.MINA_COIN_TYPE
  minaClient = new Client({ network: 'testnet' })

  reverseBytes(bytes: Buffer) {
    const uint8 = new Uint8Array(bytes)
    return new Buffer(uint8.reverse())
  }

  async buildWalletFromChildNode(
    childNode: HDKey,
    accountNumber: number
  ): Promise<KeyPair> {
    if (!childNode?.privateKey) throw new Error('Unable to derive private key')

    childNode.privateKey[0] &= 0x3f
    const childPrivateKey = this.reverseBytes(new Buffer(childNode.privateKey))
    const privateKeyHex = `5a01${childPrivateKey.toString('hex')}`
    const privateKey = bs58check.encode(Buffer.from(privateKeyHex, 'hex'))
    const publicKey = this.minaClient.derivePublicKey(privateKey)

    return {
      privateKey,
      publicKey,
      address: publicKey,
      hdIndex: accountNumber
    }
  }
}
