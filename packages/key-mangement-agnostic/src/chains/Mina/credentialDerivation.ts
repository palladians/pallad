import { Mina } from '@palladxyz/mina-core'
import Client from 'mina-signer'

import { MinaGroupedCredentials, MinaSpecificPayload } from './types'

export function deriveMinaPublicKey(
  payload: MinaSpecificPayload,
  privateKey: string
): Mina.PublicKey {
  // Mina network client.
  const minaClient = new Client({ network: payload.networkType })
  // Derive and return the Mina public key
  const publicKey = minaClient.derivePublicKey(privateKey)
  return publicKey as Mina.PublicKey
}

export function deriveMinaCredentials(
  payload: MinaSpecificPayload,
  publicCredential: Mina.PublicKey
): MinaGroupedCredentials {
  return {
    "@context": [
      "https://w3id.org/wallet/v1"
    ],
    "id": "did:mina:" + publicCredential,
    "type": "MinaAddress",
    "controller": "did:mina:" + publicCredential,
    "name": "Mina Account",
    "description": "My Mina account.",
    "chain": payload.network,
    "addressIndex": payload.addressIndex,
    "accountIndex": payload.accountIndex,
    "address": publicCredential
  }
}


export function isMinaCredential(
  credential: MinaGroupedCredentials,
  payload: MinaSpecificPayload
): boolean {
  // Check if the credential matches the payload
  return (
    credential.chain === 'Mina' &&
    credential.accountIndex === payload.accountIndex &&
    credential.addressIndex === payload.addressIndex
  )
}
