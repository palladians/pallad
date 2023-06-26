import { HDKey } from '@scure/bip32'
import { mnemonicToSeedSync } from '@scure/bip39'
import bs58check from 'bs58check'
import { Buffer } from 'buffer'
import Client from 'mina-signer'

import { Blockchain, HDPath, Wallet } from './blockchain'
import { KeyConst } from './types'

export class Mina extends Blockchain {
  PURPOSE = KeyConst.PURPOSE
  COIN_TYPE = KeyConst.MINA_COIN_TYPE
  minaClient = new Client({ network: 'testnet' })

  reverseBytes(bytes: Buffer) {
    const uint8 = new Uint8Array(bytes)
    return new Buffer(uint8.reverse())
  }

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

    // Create a HDPath object
    const hdPathObject: HDPath = {
      accountIndex: accountNumber,
      change: 0,
      index: 0
    }

    const hdPath = this.getHierarchicalDeterministicPath(hdPathObject)
    const child0 = masterNode.derive(hdPath)

    if (!child0?.privateKey) throw new Error('Unable to derive private key')

    child0.privateKey[0] &= 0x3f
    const childPrivateKey = this.reverseBytes(new Buffer(child0.privateKey))
    const privateKeyHex = `5a01${childPrivateKey.toString('hex')}`
    const privateKey = bs58check.encode(Buffer.from(privateKeyHex, 'hex'))
    const publicKey = this.minaClient.derivePublicKey(privateKey)

    return {
      privateKey,
      publicKey,
      address: '', // You need to add logic to derive the address.
      hdIndex: accountNumber
    }
  }
}
