import * as starknet from 'micro-starknet'

import {
  StarknetGroupedCredentials,
  StarknetSpecificArgs,
  StarknetSpecificPayload
} from './types'

export function deriveStarknetPublicAddress(privateKey: Uint8Array) {
  const hexPrivateKey = Buffer.from(privateKey).toString('hex')
  const starkKey = starknet.getStarkKey(hexPrivateKey)
  return starkKey
}

export function deriveStarknetCredentials(
  args: StarknetSpecificArgs,
  publicCredential: string,
  encryptedPrivateKeyBytes: Uint8Array
): StarknetGroupedCredentials {
  return {
    '@context': ['https://w3id.org/wallet/v1'],
    id: 'did:starknet:' + publicCredential,
    type: 'StarknetAddress',
    controller: 'did:starknet:' + publicCredential,
    name: 'Starknet Account',
    description: 'My Starknet account.',
    chain: args.network,
    accountIndex: 0, // default to 0 TODO: remove this
    addressIndex: args.addressIndex,
    address: publicCredential,
    encryptedPrivateKeyBytes: encryptedPrivateKeyBytes
  }
}

export function isStarknetCredential(
  credential: StarknetGroupedCredentials,
  payload: StarknetSpecificPayload
): boolean {
  // Check if the credential matches the payload
  // This is just an example, replace with your actual logic
  // This is just a mock implementation, replace with your actual logic
  return (
    credential.chain === 'Starknet' &&
    credential.addressIndex === payload.addressIndex
  )
}
