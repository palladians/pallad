import { TransactionBody } from "@mina-js/utils"
import type { Mina } from "@palladxyz/mina-core"

export function isConstructedTransaction(payload: any) {
  const transaction = TransactionBody.parse(payload)
  return !!transaction
}

export function isMessageBody(payload: any): payload is Mina.MessageBody {
  return payload && typeof payload === "object" && "message" in payload
}

export function isFields(payload: any): payload is Mina.SignableFields {
  return payload && typeof payload === "object" && "fields" in payload
}

export function isZkAppTransaction(
  payload: any,
): payload is Mina.SignableZkAppCommand {
  return (
    payload &&
    typeof payload === "object" &&
    "command" in payload &&
    "zkappCommand" in payload.command
  )
}

export function isNullifier(payload: any): payload is Mina.CreatableNullifer {
  return (
    payload &&
    typeof payload === "object" &&
    Array.isArray(payload.message) &&
    payload.message.every((item: any) => typeof item === "bigint")
  )
}
