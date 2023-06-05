import { generateMnemonic, mnemonicToSeedSync } from 'bip39'
import { BIP32Factory } from 'bip32'
import { encode } from 'bs58check'
import * as ecc from 'tiny-secp256k1'
import Client from 'mina-signer'

export const minaClient = new Client({ network: 'testnet' })

const MINA_COIN_INDEX = 12586

const bip32 = BIP32Factory(ecc)

const reverseBytes = (bytes: any) => {
  const uint8 = new Uint8Array(bytes)
  return new Buffer(uint8.reverse())
}

export const getMnemonic = () => {
  return generateMnemonic()
}

export const getHierarchicalDeterministicPath = ({ accountNumber = 0 }) => {
  const purse = 44
  const index = 0
  const charge = 0
  return `m/${purse}/${MINA_COIN_INDEX}/${accountNumber}/${charge}/${index}`
}

export const deriveWalletByMnemonic = async (mnemonic: string, accountNumber = 0) => {
  const seed = mnemonicToSeedSync(mnemonic)
  const masterNode = bip32.fromSeed(seed)
  const hdPath = getHierarchicalDeterministicPath({ accountNumber })
  const child0 = masterNode.derivePath(hdPath)
  if (child0?.privateKey) {
    child0.privateKey[0] &= 0x3f
    const childPrivateKey = reverseBytes(child0.privateKey)
    const privateKeyHex = `5a01${childPrivateKey.toString('hex')}`
    const privateKey = encode(Buffer.from(privateKeyHex, 'hex'))
    const publicKey = minaClient.derivePublicKey(privateKey)
    return {
      privateKey,
      publicKey,
      hdIndex: accountNumber
    }
  }
}

export const deriveKeyPair = async ({ mnemonic }: { mnemonic: string }) => {
  const keys = await deriveWalletByMnemonic(mnemonic)
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
