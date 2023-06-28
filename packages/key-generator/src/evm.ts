import {
  bufferToHex,
  privateToAddress,
  privateToPublic,
  toChecksumAddress
} from '@ethereumjs/util'
import { HDKey } from '@scure/bip32'

import { KeyGenerator, KeyPair } from './keyGenerator'
import { KeyConst } from './types'

/**
 * EVMKeyGenerator class extends the KeyGenerator.
 * It is used to generate Ethereum keys, following the Ethereum standards.
 *
 * @remarks
 * This class is part of the {@link @pallad/key-generator#EVMKeyGenerator | EVMKeyGenerator subsystem}.
 *
 * @beta
 */
export class EVMKeyGenerator extends KeyGenerator {
  PURPOSE = KeyConst.PURPOSE
  COIN_TYPE = KeyConst.ETHEREUM_COIN_TYPE

  /**
   * Builds a key pair from the provided HD child node and account number.
   *
   * @remarks
   * This method is part of the {@link @pallad/key-generator#EVMKeyGenerator.buildKeyPairFromChildNode | EVMKeyGenerator subsystem}.
   *
   * @param childNode - The HDKey child node from which to derive the key pair
   * @param accountNumber - The account number for the derived key pair
   * @returns A Promise that resolves to a KeyPair object, containing the derived private key, public key, address, and HD index
   *
   * @beta
   */
  async buildKeyPairFromChildNode(
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
