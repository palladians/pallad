import { Mina } from '@palladxyz/mina-core'
import Client from 'mina-signer'

import { MinaGroupedCredentials, MinaSpecificArgs } from './types'

export function deriveMinaPublicKey(
  //rename payload to args
  args: MinaSpecificArgs,
  privateKey: string
): Mina.PublicKey {
  // Mina network client.
  const minaClient = new Client({ network: args.networkType })
  // Derive and return the Mina public key
  const publicKey = minaClient.derivePublicKey(privateKey)
  return publicKey as Mina.PublicKey
}

export function deriveMinaCredentials(
  args: MinaSpecificArgs,
  publicCredential: Mina.PublicKey
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
    address: publicCredential
  }
}

export function isMinaCredential(
  credential: MinaGroupedCredentials,
  args: MinaSpecificArgs
): boolean {
  // Check if the credential matches the args
  return (
    credential.chain === 'Mina' &&
    credential.accountIndex === args.accountIndex &&
    credential.addressIndex === args.addressIndex
  )
}
