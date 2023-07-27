import { HDKey } from '@scure/bip32'

import { EthereumKeyConst, EthereumSpecificArgs } from './types'

export async function deriveEthereumPrivateKey(
  args: EthereumSpecificArgs,
  decryptedSeedBytes: Uint8Array
): Promise<Uint8Array> {
  const { accountIndex, addressIndex } = args

  // Create an HDKey from the root private key
  const rootKey = HDKey.fromMasterSeed(decryptedSeedBytes)
  const path = `m/${EthereumKeyConst.PURPOSE}'/${EthereumKeyConst.COIN_TYPE}'/${accountIndex}'/0/${addressIndex}`
  const childNode = rootKey.derive(path)
  if (!childNode?.privateKey) throw new Error('Unable to derive private key')

  const privateKey = childNode.privateKey
  // maybe want to return bufferToHex(privateKey)
  return privateKey
}
