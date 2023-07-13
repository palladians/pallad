import { HDKey } from '@scure/bip32'
import { Buffer } from 'buffer'
import Client from 'mina-signer'
import * as bs58check from 'noble-base58check'

import { KeyGenerator, KeyPair } from './keyGenerator'
import { KeyConst } from './types'

/**
 * A class for generating Mina cryptographic key pairs using HDKeys, specifically designed for the Mina network.
 *
 * @remarks
 * This class is part of the {@link @pallad/key-generator | pallad/key-generator subsystem}.
 *
 * @beta
 */
export class MinaKeyGenerator extends KeyGenerator {
  // Purpose value as per BIP43 specification.
  PURPOSE = KeyConst.PURPOSE

  // Coin type value specific to the Mina blockchain.
  COIN_TYPE = KeyConst.MINA_COIN_TYPE

  // Mina network client.
  minaClient = new Client({ network: 'testnet' })

  /**
   * Reverses the order of bytes in a buffer.
   *
   * @param bytes - Buffer containing bytes to reverse.
   * @returns Buffer with bytes in reverse order.
   */
  reverseBytes(bytes: Buffer) {
    const uint8 = new Uint8Array(bytes)
    return new Buffer(uint8.reverse())
  }

  /**
   * Derives a key pair from a given child node HDKey.
   *
   * @remarks
   * It applies specific key transformations and encodings required for the Mina network.
   *
   * @param childNode - Child node HDKey from which to derive key pair.
   * @param accountNumber - The index number of the HD account.
   * @returns Promise resolving with the derived KeyPair.
   * @throws Error if unable to derive private key from child node.
   */
  async buildKeyPairFromChildNode(
    childNode: HDKey,
    accountNumber: number
  ): Promise<KeyPair> {
    if (!childNode?.privateKey) throw new Error('Unable to derive private key')

    childNode.privateKey[0] &= 0x3f
    const childPrivateKey = this.reverseBytes(new Buffer(childNode.privateKey))
    const privateKeyHex = `5a01${childPrivateKey.toString('hex')}`
    const privateKey = await bs58check.encode(Buffer.from(privateKeyHex, 'hex'))
    const publicKey = this.minaClient.derivePublicKey(privateKey)

    return {
      privateKey,
      publicKey,
      address: publicKey,
      hdIndex: accountNumber
    }
  }
}
