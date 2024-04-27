import type { BorrowedTypes } from ".."

/**
 * Represents the body of a message.
 */
export interface MessageBody {
  message: string
}
/*
 * represents the signed message - SignedLegacy<MessageBody>
 */
export type SignedMessage = BorrowedTypes.SignedLegacy<string>
