import type { ethers } from "ethers"

export function isTransaction(
  payload: any,
): payload is ethers.TransactionRequest {
  // Check if the payload is a transaction request
  return (
    payload &&
    typeof payload === "object" &&
    "to" in payload &&
    "value" in payload &&
    "data" in payload
  )
}

export function isMessage(payload: any): payload is string | Uint8Array {
  // Check if the payload is a message (string or Uint8Array)
  return typeof payload === "string" || payload instanceof Uint8Array
}
