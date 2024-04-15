import { BorrowedTypes } from '..'

/*
 * represents the signed message - SignedLegacy<MessageBody>
 */
export type SignedFields = BorrowedTypes.Signed<bigint[]>

export type SignableFields = {
  fields: bigint[]
}
