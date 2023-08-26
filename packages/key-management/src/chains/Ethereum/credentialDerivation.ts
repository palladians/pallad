import {
  bufferToHex,
  privateToAddress,
  privateToPublic,
  toChecksumAddress
} from '@ethereumjs/util' // need to replace with noble hashes

import { EthereumGroupedCredentials, EthereumSpecificArgs } from './types'

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
  args: EthereumSpecificArgs,
  publicCredential: string,
  encryptedPrivateKeyBytes: Uint8Array
): EthereumGroupedCredentials {
  return {
    '@context': ['https://w3id.org/wallet/v1'],
    id: 'did:ethr:' + publicCredential,
    type: 'EthereumAddress',
    controller: 'did:ethr:' + publicCredential,
    name: 'Ethereum Account',
    description: 'My Ethereum account.',
    chain: args.network,
    addressIndex: args.addressIndex,
    accountIndex: args.accountIndex,
    address: publicCredential,
    encryptedPrivateKeyBytes: encryptedPrivateKeyBytes
  }
}

export function isEthereumCredential(
  credential: EthereumGroupedCredentials,
  args: EthereumSpecificArgs
): boolean {
  // Check if the credential matches the payload
  return (
    credential.chain === 'Ethereum' &&
    credential.accountIndex === args.accountIndex &&
    credential.addressIndex === args.addressIndex
  )
}
