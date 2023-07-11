import { SignedLegacy } from "mina-signer/dist/node/mina-signer/src/TSTypes"

/**
 * Represents the body of a message.
 */
export interface MessageBody {
    message: string
  }
/*
* represents the signed message - SignedLegacy<MessageBody>
*/
export type SignedMessage = SignedLegacy<string>
