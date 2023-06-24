import { HDKey } from '@scure/bip32'
import { mnemonicToSeedSync } from '@scure/bip39'
import bs58check from 'bs58check'
import { Buffer } from 'buffer'
import Client from 'mina-signer'
export { generateMnemonic, validateMnemonic } from '@scure/bip39'
export { wordlist } from '@scure/bip39/wordlists/english.js'
import { MinaHDPath, MinaKeyConst } from './types'

export const minaClient = new Client({ network: 'testnet' })

const reverseBytes = (bytes: Buffer) => {
  const uint8 = new Uint8Array(bytes)
  return new Buffer(uint8.reverse())
}

export const getHierarchicalDeterministicPath = (path: MinaHDPath) => {
  const { accountIndex = 0, change = 0, index = 0 } = path
  return `m/${MinaKeyConst.PURPOSE}'/${MinaKeyConst.COIN_TYPE}'/${accountIndex}'/${change}/${index}`
}

export const deriveWalletByMnemonic = async (
  mnemonic: string,
  accountNumber = 0
) => {
  const seed = mnemonicToSeedSync(mnemonic)
  const masterNode = HDKey.fromMasterSeed(seed)

  // Create a MinaHDPath object
  const hdPathObject: MinaHDPath = {
    accountIndex: accountNumber,
    change: 0, // According to BIP44, this is typically 0 for external (receiving) and 1 for internal (change)
    index: 0 // This is the address_index, you can change it if you want to generate more addresses from the same account
  }
  // Derive the BIP32 path from the hdPathObject
  const hdPath = getHierarchicalDeterministicPath(hdPathObject)

  const child0 = masterNode.derive(hdPath)
  if (!child0?.privateKey) return null
  child0.privateKey[0] &= 0x3f
  const childPrivateKey = reverseBytes(new Buffer(child0.privateKey))
  const privateKeyHex = `5a01${childPrivateKey.toString('hex')}`
  const privateKey = bs58check.encode(Buffer.from(privateKeyHex, 'hex'))
  const publicKey = minaClient.derivePublicKey(privateKey)
  return {
    privateKey,
    publicKey,
    hdIndex: accountNumber
  }
}

export const deriveKeyPair = async ({
  mnemonic,
  accountNumber = 0
}: {
  mnemonic: string
  accountNumber?: number
}) => {
  const keys = await deriveWalletByMnemonic(mnemonic, accountNumber)
  if (keys) {
    const { privateKey, publicKey } = keys
    return {
      privateKey,
      publicKey,
      mnemonic
    }
  }
  return null
}
