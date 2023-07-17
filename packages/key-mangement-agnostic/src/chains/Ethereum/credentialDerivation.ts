import {
  bufferToHex,
  privateToAddress,
  privateToPublic,
  toChecksumAddress
} from '@ethereumjs/util'

import { EthereumGroupedCredentials, EthereumSpecificPayload } from './types'

export async function deriveEthereumPublicAddress(
  privateKey: Uint8Array
): Promise<string> {
  const privateKeyBuffer = Buffer.from(privateKey)
  const address = toChecksumAddress(
    '0x' + privateToAddress(privateKeyBuffer).toString('hex')
  )
  return address
}

export function deriveEthereumPublicKey(privateKey: Uint8Array): string {
  const privateKeyBuffer = Buffer.from(privateKey)
  const publicKey = privateToPublic(privateKeyBuffer)

  return bufferToHex(publicKey)
}

export function deriveEthereumCredentials(
  payload: EthereumSpecificPayload,
  publicCredential: string
): EthereumGroupedCredentials {
  return {
    '@context': ['https://w3id.org/wallet/v1'],
    id: 'did:ethr:' + publicCredential,
    type: 'EthereumAddress',
    controller: 'did:ethr:' + publicCredential,
    name: 'Ethereum Account',
    description: 'My Ethereum account.',
    chain: payload.network,
    addressIndex: payload.addressIndex,
    accountIndex: payload.accountIndex,
    address: publicCredential
  }
}

export function isEthereumCredential(
  credential: EthereumGroupedCredentials,
  payload: EthereumSpecificPayload
): boolean {
  // Check if the credential matches the payload
  // This is just an example, replace with your actual logic
  // This is just a mock implementation, replace with your actual logic
  return (
    credential.chain === 'Ethereum' &&
    credential.accountIndex === payload.accountIndex &&
    credential.addressIndex === payload.addressIndex
  )
}
