import { HDKey } from '@scure/bip32'
import * as starknet from 'micro-starknet'

import { StarknetSpecificArgs } from './types'

export async function deriveStarknetPrivateKey(
  args: StarknetSpecificArgs,
  decryptedSeedBytes: Uint8Array
): Promise<string> {
  const { addressIndex, ethAddress, layer, application } = args
  // Create an HDKey from the root private key
  const rootKey = HDKey.fromMasterSeed(decryptedSeedBytes)
  // must implement https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2645.md

  const path = starknet.getAccountPath(
    layer,
    application,
    ethAddress,
    addressIndex
  )

  const childNode = rootKey.derive(path)
  if (!childNode?.privateKey) throw new Error('Unable to derive private key')

  const privateKey = childNode.privateKey
  const starknetPrivateKey = starknet.grindKey(privateKey)
  return starknetPrivateKey
}
