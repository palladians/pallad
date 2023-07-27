import { StarknetGroupedCredentials, StarknetSpecificPayload } from './types'

export function isStarknetCredential(
  credential: StarknetGroupedCredentials,
  payload: StarknetSpecificPayload
): boolean {
  // Check if the credential matches the payload
  // This is just an example, replace with your actual logic
  // This is just a mock implementation, replace with your actual logic
  return (
    credential.chain === 'Starknet' &&
    credential.accountIndex === payload.accountIx &&
    credential.addressIndex === payload.addressIx
  )
}
