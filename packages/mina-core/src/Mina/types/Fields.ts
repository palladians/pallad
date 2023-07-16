import { Signed } from 'mina-signer/dist/node/mina-signer/src/TSTypes'

/*
 * represents the signed message - SignedLegacy<MessageBody>
 */
export type SignedFields = Signed<bigint[]>

export type SignableFields = {
  fields: bigint[]
}
