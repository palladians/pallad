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
    chain: payload.network,
    addressIndex: payload.addressIx,
    accountIndex: payload.accountIx,
    address: publicCredential
  }
}

export function isMinaCredential(
  credential: MinaGroupedCredentials,
  payload: MinaSpecificPayload
): boolean {
  // Check if the credential matches the payload
  // This is just an example, replace with your actual logic
  return (
    credential.chain === 'Mina' &&
    credential.accountIndex === payload.accountIx &&
    credential.addressIndex === payload.addressIx
  )
}
