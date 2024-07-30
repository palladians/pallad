import { HDKey } from "@scure/bip32"

import {
  type EthereumDerivationArgs,
  EthereumKeyConst,
  type EthereumSpecificArgs,
} from "./types"

export function deriveEthereumPrivateKey(
  args: EthereumSpecificArgs | EthereumDerivationArgs,
  decryptedSeedBytes: Uint8Array,
): Uint8Array {
  const { accountIndex, addressIndex } = args

  // Create an HDKey from the root private key
  const rootKey = HDKey.fromMasterSeed(decryptedSeedBytes)
  const path = `m/${EthereumKeyConst.PURPOSE}'/${EthereumKeyConst.COIN_TYPE}'/${accountIndex}'/0/${addressIndex}`
  const childNode = rootKey.derive(path)
  if (!childNode?.privateKey) throw new Error("Unable to derive private key")

  return childNode.privateKey
}
