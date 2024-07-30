import { sha256 } from "@noble/hashes/sha256"
import { bytesToHex, utf8ToBytes } from "@noble/hashes/utils"
import { base58check } from "@scure/base"
import { HDKey } from "@scure/bip32"

import { type MinaDerivationArgs, MinaKeyConst } from "./types"

export function deriveMinaPrivateKey(
  args: MinaDerivationArgs,
  decryptedSeedBytes: Uint8Array,
): Uint8Array {
  const { accountIndex, addressIndex } = args

  // Create an HDKey from the root private key
  const rootKey = HDKey.fromMasterSeed(decryptedSeedBytes)
  const path = `m/${MinaKeyConst.PURPOSE}'/${MinaKeyConst.MINA_COIN_TYPE}'/${accountIndex}'/0/${addressIndex}`
  const childNode = rootKey.derive(path)
  if (!childNode?.privateKey) throw new Error("Unable to derive private key")
  if (!childNode?.privateKey?.[0]) {
    childNode.privateKey.set([0x3f], 0)
  }
  const childPrivateKey = childNode.privateKey.reverse()
  const privateKeyHex = `5a01${bytesToHex(childPrivateKey)}`
  // Convert the hex string to a Uint8Array
  if (!privateKeyHex) {
    throw new Error("privateKeyHex is empty")
  }
  const hexMatches = privateKeyHex.match(/.{1,2}/g)
  if (!hexMatches) {
    throw new Error("Failed to split privateKeyHex into bytes")
  }
  const privateKeyBytes = new Uint8Array(
    hexMatches.map((byte) => Number.parseInt(byte, 16)),
  )

  // Encode the Uint8Array into a base58 string with checksum
  const privateKey = base58check(sha256).encode(privateKeyBytes)
  return utf8ToBytes(privateKey)
}
