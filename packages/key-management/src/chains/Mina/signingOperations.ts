import Client from "mina-signer"

import { SignableData } from "../../../../mina-core/src/borrowed-types"
import * as errors from "../../errors"
import type { ChainOperationArgs } from "../../types"
import * as util from "./guards"
import type { MinaSignablePayload, MinaSignatureResult } from "./types"

export function MinaSigningOperations<T extends MinaSignablePayload>(
  payload: T,
  args: ChainOperationArgs,
  privateKey: string,
): MinaSignatureResult {
  if (!args.networkType) {
    throw new Error("networkType undefined in MinaSigningOperations.")
  }
  // Mina network client.
  const minaClient = new Client({ network: args.networkType })
  try {
    // Perform the specific signing action
    switch (args.operation) {
      case "mina_sign":
      case "mina_signTransaction": {
        if ("message" in payload) {
          return minaClient.signTransaction<string>(payload.message, privateKey)
        }
        if ("transaction" in payload) {
          return minaClient.signTransaction(payload.transaction, privateKey)
        }
        if ("command" in payload) {
          return minaClient.signTransaction(payload.command, privateKey)
        }
        throw new Error("Invalid transaction payload")
      }

      case "mina_signFields": {
        if (util.isFields(payload)) {
          return minaClient.signFields(payload.fields, privateKey)
        }
        throw new Error("Invalid signable fields")
      }

      case "mina_createNullifier": {
        if (util.isNullifier(payload)) {
          return minaClient.createNullifier(payload.message, privateKey)
        }
        throw new Error("Invalid create nullifier payload")
      }

      default:
        throw new Error("Unsupported private key operation")
    }
  } catch (err) {
    const errorMessage = errors.getRealErrorMsg(err) || "Signing action failed."
    throw new Error(errorMessage)
  }
}
