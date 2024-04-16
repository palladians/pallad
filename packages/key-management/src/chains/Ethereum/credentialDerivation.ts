import { bytesToHex } from '@noble/hashes/utils'
import * as secp256k1 from '@noble/secp256k1'
import { Address } from 'micro-eth-signer'

import {
  EthereumDerivationArgs,
  EthereumGroupedCredentials,
  EthereumSpecificArgs
} from './types'

export function deriveEthereumPublicAddress(
  privateKey: Uint8Array | string
): string {
  return Address.fromPrivateKey(privateKey)
}

/**
 * Throws if input is not a buffer
 * @param {Buffer} input value to check
 */
export const assertIsBytes = function (input: Uint8Array): void {
  if (!(input instanceof Uint8Array)) {
    const msg = `This method only supports Uint8Array but input was: ${input}`
    throw new Error(msg)
  }
}

export const privateToPublic = function (privateKey: Uint8Array): Uint8Array {
  assertIsBytes(privateKey)
  // skip the type flag and use the X, Y points
  return secp256k1.ProjectivePoint.fromPrivateKey(privateKey)
    .toRawBytes(false)
    .slice(1)
}

export function deriveEthereumPublicKey(privateKey: Uint8Array): string {
  const privateKeyBuffer = Buffer.from(privateKey)
  const publicKey = privateToPublic(privateKeyBuffer)

  return bytesToHex(publicKey)
}

export function deriveEthereumCredentials(
  args: EthereumSpecificArgs | EthereumDerivationArgs,
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
