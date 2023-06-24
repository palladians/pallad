import { HDKey } from '@scure/bip32'
import { mnemonicToSeedSync } from '@scure/bip39'
import bs58check from 'bs58check'
import { Buffer } from 'buffer'
import Client from 'mina-signer'
export { generateMnemonic, validateMnemonic } from '@scure/bip39'
export { wordlist } from '@scure/bip39/wordlists/english.js'

export const minaClient = new Client({ network: 'testnet' })

const MINA_COIN_INDEX = 12586

const reverseBytes = (bytes: Buffer) => {
  const uint8 = new Uint8Array(bytes)
  return new Buffer(uint8.reverse())
}

export const getHierarchicalDeterministicPath = ({ accountNumber = 0 }) => {
  const purse = 44
  const index = 0
  const charge = 0
  return `m/${purse}/${MINA_COIN_INDEX}/${accountNumber}/${charge}/${index}`
}

export const deriveWalletByMnemonic = async (
  mnemonic: string,
  accountNumber = 0
) => {
  const seed = mnemonicToSeedSync(mnemonic)
  const masterNode = HDKey.fromMasterSeed(seed)
  const hdPath = getHierarchicalDeterministicPath({ accountNumber })
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
