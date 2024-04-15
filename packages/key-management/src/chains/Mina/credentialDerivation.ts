import { Mina } from '@palladxyz/mina-core'
import Client from 'mina-signer'

import { MinaDerivationArgs, MinaGroupedCredentials } from './types'

export function deriveMinaPublicKey(privateKey: string): Mina.PublicKey {
  // Mina network client.
  // TODO: Check if the public key is different based on client networkType
  const minaClient = new Client({ network: 'mainnet' })
  // Derive and return the Mina public key
  const publicKey = minaClient.derivePublicKey(privateKey)
  return publicKey as Mina.PublicKey
}

export function deriveMinaCredentials(
  args: MinaDerivationArgs,
  publicCredential: Mina.PublicKey,
  encryptedPrivateKeyBytes: Uint8Array
): MinaGroupedCredentials {
  return {
    '@context': ['https://w3id.org/wallet/v1'],
    id: 'did:mina:' + publicCredential,
    type: 'MinaAddress',
    controller: 'did:mina:' + publicCredential,
    name: 'Mina Account',
    description: 'My Mina account.',
    chain: args.network,
    addressIndex: args.addressIndex,
    accountIndex: args.accountIndex,
    address: publicCredential,
    encryptedPrivateKeyBytes: encryptedPrivateKeyBytes
  }
}

export function isMinaCredential(
  credential: MinaGroupedCredentials,
  args: MinaDerivationArgs
): boolean {
  // Check if the credential matches the args
  return (
    credential.chain === 'Mina' &&
    credential.accountIndex === args.accountIndex &&
    credential.addressIndex === args.addressIndex
  )
}
